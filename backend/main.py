from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from database import get_db, engine, Base
from pydantic import BaseModel
from datetime import datetime
import models
from models import IssueStatus
from sqlalchemy.orm import Session
from typing import Optional

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Issue(BaseModel):
    id: int | None = None
    title: str
    description: str | None = None
    status: IssueStatus = IssueStatus.OPEN
    created_on: datetime | None = None
    model_config = {"from_attributes": True}


class IssueOut(BaseModel):
    id: int | None = None
    title: str
    description: Optional[str] = None
    status: IssueStatus = IssueStatus.OPEN
    created_on: Optional[int] = None  # unix timestamp (seconds)
    model_config = {"from_attributes": True}

@app.get("/listIssues", response_model=list[Issue])
def get_all_issues(db: Session = Depends(get_db)):
    try:
        issues = db.query(models.Issue).all()
        def to_out(i: models.Issue):
            return {
                "id": i.id,
                "title": i.title,
                "description": i.description,
                "status": (i.status.value if hasattr(i.status, 'value') else str(i.status)),
                "created_on": int(i.created_on.timestamp()) if i.created_on else None,
            }

        return [to_out(i) for i in issues]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.get("/getIssue/{issue_id}", response_model=IssueOut)
def get_issue_by_id(issue_id: int, db: Session = Depends(get_db)):
    try:
        issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
        if not issue:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found")
        return {
            "id": issue.id,
            "title": issue.title,
            "description": issue.description,
            "status": (issue.status.value if hasattr(issue.status, 'value') else str(issue.status)),
            "created_on": int(issue.created_on.timestamp()) if issue.created_on else None,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.post('/createIssue', response_model=IssueOut)
def create_an_issue(issue: Issue, db: Session = Depends(get_db)):
    try:
        new_issue = models.Issue(
            title=issue.title,
            status=issue.status,
            description=issue.description,
            created_on=issue.created_on or datetime.utcnow(),
        )

        db.add(new_issue)
        db.commit()
        db.refresh(new_issue)

        return {
            "id": new_issue.id,
            "title": new_issue.title,
            "description": new_issue.description,
            "status": (new_issue.status.value if hasattr(new_issue.status, 'value') else str(new_issue.status)),
            "created_on": int(new_issue.created_on.timestamp()) if new_issue.created_on else None,
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.put('/updateIssue/{issue_id}', response_model=IssueOut)
def update_an_issue(issue_id: int, issue: Issue, db: Session = Depends(get_db)):
    try:
        existing_issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()

        if not existing_issue:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found")

        existing_issue.title = issue.title
        existing_issue.status = issue.status
        existing_issue.description = issue.description

        db.commit()
        db.refresh(existing_issue)

        return {
            "id": existing_issue.id,
            "title": existing_issue.title,
            "description": existing_issue.description,
            "status": (existing_issue.status.value if hasattr(existing_issue.status, 'value') else str(existing_issue.status)),
            "created_on": int(existing_issue.created_on.timestamp()) if existing_issue.created_on else None,
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@app.delete('/deleteIssue/{issue_id}')
def delete_an_issue(issue_id: int, db: Session = Depends(get_db)):
    try:
        issue_to_delete = db.query(models.Issue).filter(models.Issue.id == issue_id).first()

        if not issue_to_delete:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found")

        db.delete(issue_to_delete)
        db.commit()

        return {"message": "Issue deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
