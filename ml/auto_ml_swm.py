"""
AutoML pipeline for accidently classifying sections of the SWM Food Safety Plan.
This script:
 1. Reads the cleaned Markdown.
 2. Splits it into sections (by header).
 3. Vectorizes text with TF-IDF.
 4. Uses TPOT to find the best classifier to predict hazard categories.

Before running, define `labels.csv` with two columns: `section, label`.
"""
import os
import re
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from tpot import TPOTClassifier
import pickle  # for saving vectorizer

# 1. Load cleaned Markdown
md_path = os.path.join(os.path.dirname(__file__), '../SWM_Food_Safety_Plan_Cleaned.md')
with open(md_path, 'r') as f:
    text = f.read()

# 2. Split by section header (## x.)
sections = re.split(r"^##\s+", text, flags=re.MULTILINE)[1:]
section_titles = []
section_texts = []
for sec in sections:
    title, *body = sec.splitlines()
    raw_title = title.strip()
    # Remove leading numbering (e.g., '1. Management Responsibility')
    clean_title = re.sub(r"^\d+\.\s*", "", raw_title)
    section_titles.append(clean_title)
    section_texts.append('\n'.join(body).strip())

# Ensure sections were parsed
if not sections or not section_titles:
    raise ValueError("No sections found in Markdown. Ensure headers use '## ' prefix.")

# 3. Load labels for supervised training
labels_path = os.path.join(os.path.dirname(__file__), 'labels.csv')
if not os.path.exists(labels_path):
    raise FileNotFoundError(f"Labels file not found: {labels_path}")

df_labels = pd.read_csv(labels_path)

# Ensure all sections have labels
missing = set(section_titles) - set(df_labels['section'])
if missing:
    raise ValueError(f"Missing label entries for sections: {missing}")

# 4. Prepare DataFrame
df = pd.DataFrame({'section': section_titles, 'text': section_texts})
df = df.merge(df_labels, on='section')

# 5. Vectorize text
tfidf = TfidfVectorizer(max_features=500)
X = tfidf.fit_transform(df['text'])
y = df['label']

# 6. Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 7. TPOT AutoML
tpot = TPOTClassifier(generations=5, population_size=20, verbosity=2, random_state=42)
tpot.fit(X_train.toarray(), y_train)

print("Test Score:", tpot.score(X_test.toarray(), y_test))

# Export the best model and TF-IDF vectorizer
tpot_export_dir = os.path.join(os.path.dirname(__file__), 'exported')
if not os.path.exists(tpot_export_dir):
    os.makedirs(tpot_export_dir)

best_model_path = os.path.join(tpot_export_dir, 'best_model.py')
tpot.export(best_model_path)

# Save the fitted TF-IDF vectorizer
vectorizer_path = os.path.join(tpot_export_dir, 'tfidf_vectorizer.pkl')
with open(vectorizer_path, 'wb') as vf:
    pickle.dump(tfidf, vf)

print(f"Exported model to {best_model_path}")
print(f"Exported vectorizer to {vectorizer_path}")
