import sys
import os

# Add root directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.app.database import SessionLocal
from backend.app.mock_data import clear_demo_data

def main():
    db = SessionLocal()
    try:
        clear_demo_data(db)
        print("Done! Demo data has been wiped. You can now test with real data.")
    except Exception as e:
        print("Error clearing demo data:", e)
    finally:
        db.close()

if __name__ == "__main__":
    main()
