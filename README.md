# 🌍 LULC Change Detection and Prediction

This project focuses on **Land Use and Land Cover (LULC)** change detection and future prediction using satellite imagery and machine learning. By analyzing spatial patterns over time, it aims to provide insights into urban expansion, deforestation, agricultural shifts, and other major land transformations.

---

## 📌 Objectives

- Detect LULC changes from multi-temporal satellite imagery
- Visualize historical land cover changes using remote sensing data
- Predict future LULC scenarios using machine learning models

---


# 🛰️ LULC Classification Dataset (Telangana, India: 2017–2022)

## 📂 Dataset Overview

This dataset consists of Land Use Land Cover (LULC) classification maps in GeoTIFF (.tif) format for the state of Telangana, India, spanning the years 2017 to 2022. The maps were generated using supervised classification techniques in Google Earth Engine (GEE) and can be used for change detection, environmental monitoring, and land resource management.

## 📁 Files Available

- `2017_tel.tif`
- `2018_tel.tif`
- `2019_tel.tif`
- `2020_tel.tif`
- `2021_tel.tif`
- `2022_tel.tif`

Each file contains a raster image with pixel values representing LULC class labels.

## 🏷️ LULC Classes and Color Legend

| Class Name           | Value | Color Code |
|----------------------|-------|------------|
| Water                | 1     | `#1a5bab`  |
| Trees                | 2     | `#358221`  |
| Flooded Vegetation   | 4     | `#87d19e`  |
| Crops                | 5     | `#f4a261`  |
| Built Area           | 7     | `#ed022a`  |
| Bare Ground          | 8     | `#e9dc9a`  |
| Snow/Ice             | 9     | `#f2faff`  |
| Clouds               | 10    | `#c8c8c8`  |
| Rangeland            | 11    | `#cfba77`  |

## 📥 Download Link

Access the GeoTIFF files from this Google Drive folder:  
[Google Drive Folder](https://drive.google.com/drive/folders/1hlk53TQhYs-tJCnpjAUMDPuJ7vwSurZR?usp=sharing)




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

