import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, learning_curve, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report, roc_curve, auc
import joblib
import os

# Create graphs directory if not exists
if not os.path.exists("notebooks/graphs"):
    os.makedirs("notebooks/graphs")

def load_and_preprocess():
    print("Loading data...")
    columns = [
        'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 
        'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target'
    ]
    # Path assuming script is run from project root
    if os.path.exists('backend/processed.cleveland.data'):
        df = pd.read_csv('backend/processed.cleveland.data', header=None, names=columns, na_values='?')
    else:
        # Fallback if running from notebooks dir
        df = pd.read_csv('../backend/processed.cleveland.data', header=None, names=columns, na_values='?')
    
    # Handle missing values
    df = df.dropna()
    
    # Convert target to binary
    df['target'] = df['target'].apply(lambda x: 1 if x > 0 else 0)
    
    return df

def perform_eda(df):
    print("Performing EDA...")
    
    # 1. Correlation Matrix (Relation Matrix)
    plt.figure(figsize=(12, 10))
    sns.heatmap(df.corr(), annot=True, cmap='coolwarm', fmt=".2f")
    plt.title("Feature Correlation Matrix")
    plt.savefig("notebooks/graphs/relation_matrix.png")
    plt.close()
    
    # 2. Target Distribution (EDA Graph)
    plt.figure(figsize=(6, 4))
    sns.countplot(x='target', data=df, palette='viridis')
    plt.title("Target Distribution (0: Healthy, 1: Disease)")
    plt.savefig("notebooks/graphs/eda_target_distribution.png")
    plt.close()
    
    # 3. Age Distribution by Target
    plt.figure(figsize=(10, 6))
    sns.histplot(data=df, x='age', hue='target', kde=True, element="step")
    plt.title("Age Distribution by Heart Disease Status")
    plt.savefig("notebooks/graphs/eda_age_distribution.png")
    plt.close()

    # 4. Feature Correlation with Target (Bar Plot)
    plot_feature_target_correlation(df)

    # 5. Pair Plot
    print("Generating Pair Plot...")
    # using corner=True to reduce clutter and processing time
    pp = sns.pairplot(df, hue='target', palette='husl', corner=True)
    pp.savefig("notebooks/graphs/eda_pairplot.png")
    plt.close()

def plot_feature_target_correlation(df):
    # Calculate correlation of all features with 'target'
    corr_with_target = df.corr()['target'].drop('target').sort_values()
    
    plt.figure(figsize=(10, 8))
    # Color bars based on positive/negative correlation
    colors = ['red' if x > 0 else 'blue' for x in corr_with_target]
    sns.barplot(x=corr_with_target.values, y=corr_with_target.index, palette=colors)
    plt.title("Feature Correlation with Target (Heart Disease)")
    plt.xlabel("Correlation Coefficient")
    plt.axvline(x=0, color='black', linestyle='--')
    plt.tight_layout()
    plt.savefig("notebooks/graphs/feature_target_correlation.png")
    plt.close()

def plot_learning_curve(estimator, title, X, y, cv=5):
    print(f"Generating Learning Curve for {title}...")
    train_sizes, train_scores, test_scores = learning_curve(
        estimator, X, y, cv=cv, n_jobs=1, train_sizes=np.linspace(0.1, 1.0, 5)
    )
    
    train_scores_mean = np.mean(train_scores, axis=1)
    test_scores_mean = np.mean(test_scores, axis=1)
    
    plt.figure()
    plt.title(title)
    plt.xlabel("Training examples")
    plt.ylabel("Score (Accuracy)")
    plt.grid()
    plt.plot(train_sizes, train_scores_mean, 'o-', color="r", label="Training score")
    plt.plot(train_sizes, test_scores_mean, 'o-', color="g", label="Cross-validation score")
    plt.legend(loc="best")
    plt.savefig(f"notebooks/graphs/learning_curve_{title.replace(' ', '_')}.png")
    plt.close()

def plot_roc_curve(model, X_test, y_test, model_name):
    # Check if model supports predict_proba
    if hasattr(model, "predict_proba"):
        y_prob = model.predict_proba(X_test)[:, 1]
    else:
        return

    fpr, tpr, _ = roc_curve(y_test, y_prob)
    roc_auc = auc(fpr, tpr)

    plt.figure()
    plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (area = {roc_auc:.2f})')
    plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title(f'Predicted vs Actual (ROC) - {model_name}')
    plt.legend(loc="lower right")
    plt.savefig(f"notebooks/graphs/predicted_vs_actual_roc_{model_name.replace(' ', '_')}.png")
    plt.close()

def plot_confusion_matrix(y_true, y_pred, model_name):
    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(6, 5))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', cbar=False)
    plt.title(f"Confusion Matrix - {model_name}")
    plt.ylabel('Actual')
    plt.xlabel('Predicted')
    plt.savefig(f"notebooks/graphs/confusion_matrix_{model_name.replace(' ', '_')}.png")
    plt.close()

def train_and_evaluate(df):
    X = df.drop('target', axis=1)
    y = df['target']
    
    # Scaling
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
    
    models = {
        "Logistic Regression": LogisticRegression(),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "SVM": SVC(probability=True),
        "KNN": KNeighborsClassifier(n_neighbors=5),
        "Gradient Boosting": GradientBoostingClassifier(random_state=42)
    }
    
    results = []
    best_model = None
    best_accuracy = 0.0
    best_model_name = ""
    
    print("\nTraining Models...")
    
    for name, model in models.items():
        print(f"Training {name}...")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred)
        rec = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        
        results.append({
            "Model": name,
            "Accuracy": acc,
            "Precision": prec,
            "Recall": rec,
            "F1 Score": f1
        })
        
        # Save Confusion Matrix
        plot_confusion_matrix(y_test, y_pred, name)
        
        # Save ROC Curve (Predicted vs Actual)
        plot_roc_curve(model, X_test, y_test, name)
        
        if acc > best_accuracy:
            best_accuracy = acc
            best_model = model
            best_model_name = name
            
    # Save Results to CSV
    results_df = pd.DataFrame(results)
    results_df.to_csv("notebooks/model_comparison_results.csv", index=False)
    
    # Plot Model Comparison
    plt.figure(figsize=(10, 6))
    sns.barplot(x='Accuracy', y='Model', data=results_df, palette='magma')
    plt.title("Model Accuracy Comparison")
    plt.xlim(0, 1.0)
    plt.savefig("notebooks/graphs/model_comparison.png")
    plt.close()
    
    print(f"\nBest Base Model: {best_model_name} with Accuracy: {best_accuracy:.4f}")

    # Generate Learning Curve (Epochs vs Loss proxy) for the Best Model
    plot_learning_curve(best_model, f"Learning Curve ({best_model_name})", X_scaled, y)


    # --- Hyperparameter Tuning (Grid Search) ---
    print("\n--- Starting Hyperparameter Tuning for Random Forest ---")
    
    param_grid = {
        'n_estimators': [50, 100, 200],
        'max_depth': [None, 10, 20, 30],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }
    
    rf = RandomForestClassifier(random_state=42)
    grid_search = GridSearchCV(estimator=rf, param_grid=param_grid, 
                               cv=5, n_jobs=-1, verbose=1, scoring='accuracy')
    
    grid_search.fit(X_train, y_train)
    
    best_tuned_rf = grid_search.best_estimator_
    best_params = grid_search.best_params_
    
    # Evaluate Tuned Model
    y_pred_tuned = best_tuned_rf.predict(X_test)
    tuned_acc = accuracy_score(y_test, y_pred_tuned)
    
    print(f"Best Parameters: {best_params}")
    print(f"Tuned Random Forest Accuracy: {tuned_acc:.4f}")
    
    # Compare with Base Best Model
    final_model = best_model
    final_acc = best_accuracy
    final_name = best_model_name
    
    if tuned_acc > best_accuracy:
        print("-> Tuned Random Forest performed better than the best base model!")
        final_model = best_tuned_rf
        final_acc = tuned_acc
        final_name = "Tuned Random Forest"
    elif best_model_name == "Random Forest" and tuned_acc >= best_accuracy:
        print("-> Tuned Random Forest matches base performance. Using tuned version for robustness.")
        final_model = best_tuned_rf
        final_acc = tuned_acc
        final_name = "Tuned Random Forest"
    else:
        print(f"-> Base {best_model_name} still performs best.")

    print(f"\nFINAL SELECTED MODEL: {final_name} ({final_acc:.4f})")

    # Save Best Model Logic
    if "Random Forest" in final_name or final_name == "Gradient Boosting":
        print("Retraining final model on unscaled data for compatibility with app.py...")
        X_train_u, X_test_u, y_train_u, y_test_u = train_test_split(X, y, test_size=0.2, random_state=42)
        
        if final_name == "Tuned Random Forest":
            final_model_to_save = RandomForestClassifier(**best_params, random_state=42)
        else:
            final_model_to_save = final_model # Base model
            
        final_model_to_save.fit(X_train_u, y_train_u)
        
        joblib.dump(final_model_to_save, 'backend/model.pkl')
        print(f"Saved {final_name} to backend/model.pkl")
    else:
        print("Best model requires scaling. Saving fallback Random Forest (Tuned) for compatibility.")
        X_train_u, X_test_u, y_train_u, y_test_u = train_test_split(X, y, test_size=0.2, random_state=42)
        rf_fallback = RandomForestClassifier(**best_params, random_state=42)
        rf_fallback.fit(X_train_u, y_train_u)
        joblib.dump(rf_fallback, 'backend/model.pkl')
        print("Saved Tuned Random Forest to backend/model.pkl (Best compatible model)")
    
    # Plot Learning Curve for the Final Model as well
    plot_learning_curve(final_model, f"Learning Curve ({final_name})", X_scaled, y)

if __name__ == "__main__":
    df = load_and_preprocess()
    perform_eda(df)
    train_and_evaluate(df)
