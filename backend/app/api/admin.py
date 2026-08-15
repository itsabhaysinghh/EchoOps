from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.mock_data import clear_demo_data, seed_database
from backend.app.api.auth_dep import get_current_user

router = APIRouter(prefix="/api/admin", tags=["Admin"], dependencies=[Depends(get_current_user)])

@router.post("/clear-demo-data")
def clear_demo(db: Session = Depends(get_db)):
    """
    Purges all demo data from SQLite database so user can test with real data.
    """
    try:
        clear_demo_data(db)
        return {
            "status": "success",
            "message": "Demo data cleared successfully. Database is clean and ready for real data ingestion."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear demo data: {str(e)}")

@router.post("/seed-demo-data")
def seed_demo(db: Session = Depends(get_db)):
    """
    Re-seeds database with sample demo data.
    """
    try:
        seed_database(db)
        return {
            "status": "success",
            "message": "Database re-seeded with demo data successfully."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to seed demo data: {str(e)}")
