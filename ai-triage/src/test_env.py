import sys

print("Python version:", sys.version)

try:
    import pandas as pd
    import numpy as np

    print("Pandas version:", pd.__version__)
    print("NumPy version:", np.__version__)
    print("Totul merge ✔")

except Exception as e:
    print("Eroare:", e)