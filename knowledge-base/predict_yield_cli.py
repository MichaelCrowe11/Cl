
import argparse
import joblib
import pandas as pd

model = joblib.load("crowe_yield_predictor_rf.pkl")

parser = argparse.ArgumentParser()
parser.add_argument("--species", required=True)
parser.add_argument("--substrate", required=True)
parser.add_argument("--incubation_temp", type=float, required=True)
parser.add_argument("--fruiting_temp", type=float, required=True)
parser.add_argument("--humidity", type=float, required=True)
parser.add_argument("--co2", type=float, required=True)
parser.add_argument("--light_hours", type=float, required=True)
parser.add_argument("--flush_number", type=int, required=True)
args = parser.parse_args()

input_data = pd.DataFrame([{
    "species": args.species,
    "substrate_type": args.substrate,
    "incubation_temp": args.incubation_temp,
    "fruiting_temp": args.fruiting_temp,
    "humidity_avg": args.humidity,
    "co2_ppm": args.co2,
    "light_hours": args.light_hours,
    "flush_number": args.flush_number
}])

input_data = pd.get_dummies(input_data).reindex(columns=model.feature_names_in_, fill_value=0)

prediction = model.predict(input_data)
print(f"Predicted yield per block: {prediction[0]:.2f} lbs")
