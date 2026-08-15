from backend.app.database import SessionLocal
from backend.app.mock_data import clear_demo_data
from backend.app.schemas import IntegrationConnect
from backend.app.api.integrations import get_integrations, connect_integration, disconnect_integration, rescan_integrations
from backend.app.models import Issue, Feedback, IntegrationSetting

def test_link_flow():
    print("--- 1. Purging demo data ---")
    db = SessionLocal()
    try:
        clear_demo_data(db)
    finally:
        db.close()
        
    db = SessionLocal()
    try:
        print("\n--- 2. Fetching initial integrations ---")
        items = get_integrations(db=db)
        print("Default integrations count:", len(items))
        assert len(items) >= 8

        print("\n--- 3. Connecting Google Play Store URL ---")
        conn_play = IntegrationConnect(
            tool_name="Google Play Store",
            config_data={"url": "https://play.google.com/store/apps/details?id=com.acme.app"}
        )
        res_play = connect_integration(conn_play, db=db)
        print("Connected Play Store:", res_play.is_connected, res_play.config_data)
        assert res_play.is_connected is True

        # Verify reviews and issues were automatically created
        issues_count = db.query(Issue).count()
        fb_count = db.query(Feedback).count()
        print("Ingested issues count after Play Store link connect:", issues_count)
        print("Ingested feedback count after Play Store link connect:", fb_count)
        assert issues_count > 0
        assert fb_count > 0

        print("\n--- 4. Connecting Instagram URL ---")
        conn_insta = IntegrationConnect(
            tool_name="Instagram",
            config_data={"url": "https://www.instagram.com/p/C-checkout-crash/"}
        )
        res_insta = connect_integration(conn_insta, db=db)
        print("Connected Instagram:", res_insta.is_connected)
        assert res_insta.is_connected is True

        print("\n--- 5. Testing Rescan Active Links ---")
        rescan_res = rescan_integrations(db=db)
        print("Rescan result:", rescan_res)
        assert rescan_res["scanned_count"] >= 2

        print("\n--- 6. Testing Disconnect / Unlink ---")
        dis_res = disconnect_integration(tool_name="Google Play Store", db=db)
        print("Disconnect response:", dis_res)
        
        setting = db.query(IntegrationSetting).filter(IntegrationSetting.tool_name == "Google Play Store").first()
        print("Play store setting is_connected:", setting.is_connected)
        assert setting.is_connected is False

        print("\nALL LINK INGESTION & INTEGRATION TESTS PASSED PERFECTLY!")
    finally:
        db.close()

if __name__ == "__main__":
    test_link_flow()
