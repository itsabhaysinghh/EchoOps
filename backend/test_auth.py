from backend.app.database import SessionLocal
from backend.app.mock_data import seed_database
from backend.app.schemas import EmailPasswordLogin, UserRegisterRequest
from backend.app.api.auth import login, register
from fastapi import HTTPException

def test_auth_system():
    print("--- 1. Seeding clean database ---")
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
        
    db = SessionLocal()
    try:
        print("\n--- 2. Testing Login with Correct Password ---")
        req_correct = EmailPasswordLogin(email="superadmin@acme.io", password="password123")
        res_correct = login(req_correct, db=db)
        assert res_correct.access_token is not None
        assert res_correct.user.email == "superadmin@acme.io"
        print("SUCCESS: Logged in with correct password.")
        
        print("\n--- 3. Testing Login with Incorrect Password ---")
        req_wrong = EmailPasswordLogin(email="superadmin@acme.io", password="wrongpassword!")
        try:
            login(req_wrong, db=db)
            assert False, "Expected 401 HTTPException"
        except HTTPException as exc:
            print("Caught expected exception:", exc.status_code, exc.detail)
            assert exc.status_code == 401
            assert exc.detail == "Invalid email or password"
        print("SUCCESS: Rejected incorrect password.")
        
        print("\n--- 4. Testing User Registration with New Email ---")
        new_user = UserRegisterRequest(
            email="newdev@echoops.io",
            password="mypassword123",
            name="New Developer",
            role="Developer"
        )
        res_reg = register(new_user, db=db)
        assert res_reg.access_token is not None
        assert res_reg.user.email == "newdev@echoops.io"
        print("SUCCESS: Registered new user account.")

        print("\n--- 5. Testing Single Account Constraint (Duplicate Registration Attempt) ---")
        # Same email, exact match
        try:
            register(new_user, db=db)
            assert False, "Expected 400 HTTPException for duplicate registration"
        except HTTPException as exc:
            print("Caught expected duplicate exception:", exc.status_code, exc.detail)
            assert exc.status_code == 400
            assert "already exists" in exc.detail

        # Same email, different case (e.g. NEWDEV@ECHOOPS.IO)
        dup_cased = UserRegisterRequest(
            email="NEWDEV@ECHOOPS.IO",
            password="anotherpassword",
            name="Different Cased Name",
            role="Admin"
        )
        try:
            register(dup_cased, db=db)
            assert False, "Expected 400 HTTPException for uppercase duplicate registration"
        except HTTPException as exc:
            print("Caught expected uppercase duplicate exception:", exc.status_code, exc.detail)
            assert exc.status_code == 400
            assert "already exists" in exc.detail
        print("SUCCESS: Successfully blocked duplicate account creation across case variations.")

        print("\n--- 6. Testing Login for Newly Registered User ---")
        req_new_login = EmailPasswordLogin(email="NEWDEV@echoops.io", password="mypassword123")
        res_new_login = login(req_new_login, db=db)
        assert res_new_login.access_token is not None
        print("SUCCESS: Newly registered user logged in successfully.")

        req_new_wrong = EmailPasswordLogin(email="newdev@echoops.io", password="badpassword")
        try:
            login(req_new_wrong, db=db)
            assert False, "Expected 401 HTTPException for wrong password on new account"
        except HTTPException as exc:
            assert exc.status_code == 401
        print("SUCCESS: Wrong password rejected for newly registered account.")

        print("\nALL BACKEND AUTHENTICATION TESTS PASSED PERFECTLY!")
    finally:
        db.close()

if __name__ == "__main__":
    test_auth_system()
