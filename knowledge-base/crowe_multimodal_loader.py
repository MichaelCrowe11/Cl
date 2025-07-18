# crowe_multimodal_loader.py

import torch
import torch.nn as nn
import torch.nn.functional as F

# Define architecture again (must match exactly)
class TabularEncoder(nn.Module):
    def __init__(self, input_dim, output_dim=32):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Linear(input_dim, 64), nn.ReLU(),
            nn.Linear(64, output_dim), nn.ReLU()
        )
    def forward(self, x): return self.layers(x)

class TextEncoder(nn.Module):
    def __init__(self, embedding_dim, output_dim=32):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Linear(embedding_dim, 64), nn.ReLU(),
            nn.Linear(64, output_dim), nn.ReLU()
        )
    def forward(self, x): return self.layers(x)

class SensorTimeSeries(nn.Module):
    def __init__(self, input_dim, hidden_dim=32, output_dim=32):
        super().__init__()
        self.lstm = nn.LSTM(input_dim, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, output_dim)
    def forward(self, x):
        _, (hn, _) = self.lstm(x)
        return self.fc(hn[-1])

class ImageEncoder(nn.Module):
    def __init__(self, output_dim=32):
        super().__init__()
        self.cnn = nn.Sequential(
            nn.Conv2d(3, 16, 3, padding=1), nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(16, 32, 3, padding=1), nn.ReLU(),
            nn.AdaptiveAvgPool2d((1, 1))
        )
        self.fc = nn.Linear(32, output_dim)
    def forward(self, x):
        return self.fc(self.cnn(x).flatten(1))

class MultiTaskHead(nn.Module):
    def __init__(self, input_dim):
        super().__init__()
        self.fc_shared = nn.Sequential(nn.Linear(input_dim, 128), nn.ReLU())
        self.regression_output = nn.Linear(128, 1)
        self.classification_output = nn.Linear(128, 5)
    def forward(self, x):
        shared = self.fc_shared(x)
        return torch.sigmoid(self.regression_output(shared)), torch.softmax(self.classification_output(shared), dim=1)

class CroweLogic(nn.Module):
    def __init__(self, tab_dim, text_emb_dim, sensor_dim, img_channels):
        super().__init__()
        self.tab_enc = TabularEncoder(tab_dim)
        self.text_enc = TextEncoder(text_emb_dim)
        self.sensor_enc = SensorTimeSeries(sensor_dim)
        self.img_enc = ImageEncoder()
        combined_dim = 32 + 32 + 32 + 32
        self.multitask_head = MultiTaskHead(combined_dim)
    def forward(self, tabular, text_emb, sensor_seq, image):
        t = self.tab_enc(tabular)
        tx = self.text_enc(text_emb)
        s = self.sensor_enc(sensor_seq)
        i = self.img_enc(image)
        fused = torch.cat([t, tx, s, i], dim=1)
        return self.multitask_head(fused)

# Load model
def load_model(path="crowe_multimodal_v1.pt"):
    model = CroweLogic(tab_dim=10, text_emb_dim=50, sensor_dim=12, img_channels=3)
    model.load_state_dict(torch.load(path, map_location=torch.device('cpu')))
    model.eval()
    return model

# Example use
if __name__ == "__main__":
    model = load_model()
    print("Model loaded and ready.")
