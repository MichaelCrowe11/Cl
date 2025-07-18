"""
myco_ml.py  –  machine-learning scaffold for ‘A Journey Into Mycology’ cultivation data
---------------------------------------------------------------------------
pip install pandas scikit-learn
"""

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.neighbors import KNeighborsRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

# ------------------------------------------------------------------------
# 1. CULTURE-MEDIA DATA  (recipes → tidy records)
# ------------------------------------------------------------------------
agar = {
    "recipe": "Malt Extract Agar",
    "target_volume_ml": 1000,
    "components": {
        "water": 1000,
        "agar_agar_g": 20,
        "barley_malt_powder_g": 20,
        "nutritional_yeast_g": 2,
        "soy_peptone_g": 1,
    },
    "sterilisation_min": 40,
    "sterilisation_psi": 15,
}  # lines with full formula & cycle settings

liquid = {
    "recipe": "Light Malt-Dextrose LC",
    "target_volume_ml": 500,
    "components": {
        "water": 500,
        "light_malt_extract_tsp": 1,
    },
    "sterilisation_min": 40,
    "sterilisation_psi": 15,
}  # 500 mL, 1 tsp malt sugar, 30-45 min @15 psi

media_df = pd.DataFrame([agar, liquid])

# ------------------------------------------------------------------------
# 2. GRAIN-SPAWN & STERILISATION DATA
# ------------------------------------------------------------------------
grain_spawn = pd.DataFrame(
    [
        {
            "dry_grain_lb": 3.8,
            "water_lb": 2.2,
            "moisture_pct": 40,
            "sterile_min": 240,
            "sterile_psi": 15,
            "contam_rate_label": 0,  # 0 = “clean” after author’s tests
        }
    ]
)  # prep & 4-h cycle @15 psi

# Additional rows can be appended if you track future batches with other
# times / PSI values and whether they succeeded (label 0) or contaminated (label 1).

# ------------------------------------------------------------------------
# 3. SPECIES-SPECIFIC ENVIRONMENTAL SET-POINTS
# ------------------------------------------------------------------------
env_specs = [
    # species, substrate, colonise_F, fruit_F, RH_pct, light_note
    ("Shiitake", "HW sawdust+bran", 72, 60, 85, "indirect"),
    ("Blue Oyster", "Straw/HW sawdust", 80, 65, 90, "bright indirect"),
    ("Pink Oyster", "Straw/HW sawdust", 80, 75, 90, "bright indirect"),
    ("Lion's Mane", "HW sawdust+soy hull", 70, 65, 92, "low light"),
]  # extracted from full table pages 195-196

env_df = pd.DataFrame(
    env_specs,
    columns=[
        "species",
        "substrate",
        "colonise_F",
        "fruit_F",
        "humidity_pct",
        "light",
    ],
)

# ------------------------------------------------------------------------
# 4-A. CLASSIFIER: Does my sterilisation protocol succeed?
# ------------------------------------------------------------------------
X = grain_spawn[["moisture_pct", "sterile_min", "sterile_psi"]]
y = grain_spawn["contam_rate_label"]

# If you log multiple batches the split becomes meaningful; here it’s illustrative
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

clf = LogisticRegression()
clf.fit(X_train, y_train)
print("Dummy accuracy on sterilisation success model:", clf.score(X_test, y_test))

# ------------------------------------------------------------------------
# 4-B. K-NN recommender: suggest fruiting set-points for an unseen species
# ------------------------------------------------------------------------
num_features = ["colonise_F", "fruit_F", "humidity_pct"]
cat_features = ["substrate"]

pre = ColumnTransformer(
    transformers=[("cat", OneHotEncoder(handle_unknown="ignore"), cat_features)],
    remainder="passthrough",
)

knn_model = Pipeline([("prep", pre), ("knn", KNeighborsRegressor(n_neighbors=1))])
knn_model.fit(env_df[cat_features + num_features], env_df[num_features])

def recommend(species_name: str):
    row = env_df[env_df["species"] == species_name]
    if row.empty:
        raise ValueError("Species not in table.")
    return row

print("\nRecommended parameters for Lion's Mane:\n", recommend("Lion's Mane"))

# ------------------------------------------------------------------------
# 5. Saving the curated tables to CSV for future model iterations
# ------------------------------------------------------------------------

{
  "title": "Grow Tent Automation Equipment – Crowe Logic Profile",
  "author": "Michael Crowe",
  "version": "v1.0",
  "profile_use": "Modular grow tent setup for mushroom cultivation environments (10x10 tent per cell)",
  "system_tags": ["[MUSHROOM]", "[ENVIRONMENTAL_CONTROL]", "[AUTOMATION]", "[SCALABLE_SYSTEM]"],
  "equipment_profile": {
    "structure": {
      "grow_tents": {
        "brand": "Gorilla Grow Tent",
        "dimensions": "10x10 ft",
        "notes": "Modular cell used for fruiting and incubation division"
      }
    },
    "air_filtration": {
      "intake_unit": {
        "brand": "AC Infinity",
        "model": "Inline Filter Box 6\"",
        "specs": "Whole-house HVAC rated",
        "application": "Fresh air intake to maintain FAE and negative pressure"
      },
      "exhaust_unit": {
        "brand": "HYDROFARM",
        "model": "ACDF8 Active Air 8\"",
        "usage_ratio": "1 fan per grow room (exhaust), 1 fan for every 2 rooms (intake)"
      }
    },
    "humidity_system": {
      "misters": {
        "brand": "House of Hydro",
        "model": "12 Disc XL Ultrasonic Mist Maker Kit",
        "units_per_tent": 2,
        "note": "Each pair services one 10x10 tent"
      },
      "controller": {
        "brand": "House of Hydro",
        "type": "Greenhouse Humidistat",
        "function": "Automates RH cycling"
      },
      "fan": {
        "type": "Waterproof Mixing Fan",
        "brand": "House of Hydro",
        "usage": "Distributes mist to prevent condensation and water pooling"
      },
      "reservoir": {
        "brand": "CRAFTSMAN",
        "size": "20 gallons",
        "type": "Heavy-duty tote with lid",
        "float_valve": "House of Hydro Mini Float Valve, 1/2\""
      }
    },
    "ducting_components": {
      "fitting": "IMPERIAL 6\" Adjustable Galvanized Elbow",
      "collar": "IMPERIAL Duct Starting Collar"
    },
    "lighting": {
      "brand": "SURNIE",
      "type": "LED Rope Light",
      "length": "150 ft",
      "color_temp": "6500K Daylight White",
      "use": "Fruiting chamber lighting"
    }
  },
  "integration_notes": {
    "CLX_models": [
      "[PHASE] Fruiting",
      "[YIELD] Optimized through stable 90–95% RH",
      "[PROBLEM] CO2 buildup mitigated via inline fan configuration"
    ],
    "CroweLayer_sync": true,
    "field_verified": true,
    "sources": [
      "The Power of Mindset in Mycology",
      "Mushroom Blueprint – 90 Days",
      "Mycelium EI Environmental Intelligence",
      "Making 95 Blocks of Hardwood Substrate"
    ]
  }
}

media_df.to_csv("media_recipes.csv", index=False)
grain_spawn.to_csv("grain_spawn_log.csv", index=False)
env_df.to_csv("environment_specs.csv", index=False)

print("\nData exported.  Extend or replace these CSVs as you gather new runs!")