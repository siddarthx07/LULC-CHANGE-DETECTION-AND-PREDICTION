# 🌍 LULC Change Detection and Prediction

This project focuses on **Land Use and Land Cover (LULC)** change detection and future prediction using satellite imagery and machine learning. By analyzing spatial patterns over time, it aims to provide insights into urban expansion, deforestation, agricultural shifts, and other major land transformations.

---

## 📌 Objectives

- Detect LULC changes from multi-temporal satellite imagery
- Visualize historical land cover changes using remote sensing data
- Predict future LULC scenarios using machine learning models

---

## 🧠 Key Features

- 📊 **Change Detection** using NDVI and classification techniques
- 🛰️ **Satellite Imagery Analysis** (Sentinel, Landsat)
- 🧾 **Data Preprocessing**: Noise reduction, band selection, cloud masking
- 🧮 **ML-Based Prediction**: Random Forest / XGBoost for land cover forecasting
- 🌐 **Visualization**: Heatmaps and color-coded LULC maps using Matplotlib / Folium / QGIS

---

## 📂 Project Structure

```bash


⚙️ Setup Instructions
1. Clone the Repository
git clone https://github.com/siddarthx07/LULC-CHANGE-DETECTION-AND-PREDICTION.git
cd LULC-CHANGE-DETECTION-AND-PREDICTION

2. Create a Virtual Environment
python -m venv env
source env/bin/activate  # For Windows: env\Scripts\activate

3. Install Dependencies
pip install -r requirements.txt

If requirements.txt is missing, manually install core packages:
pip install numpy pandas matplotlib rasterio scikit-learn geopandas seaborn


🖼️ Sample Outputs
<table> <tr> <td><img src="docs/lulc_change_map.png" alt="Change Map" width="300"/></td> <td><img src="docs/lulc_prediction.png" alt="Prediction" width="300"/></td> </tr> </table>
🔮 LULC Prediction Workflow
Load historical LULC classified rasters

Extract transition matrices and feature statistics

Train ML model (e.g., Random Forest) to learn change patterns

Predict future raster based on learned transitions

🛠️ Tools & Technologies
Python

GeoPandas

Rasterio

Scikit-learn

Matplotlib / Seaborn

QGIS (for validation)

📈 Evaluation Metrics
Confusion Matrix

Accuracy, Precision, Recall

Kappa Coefficient

LULC transition matrix comparison

