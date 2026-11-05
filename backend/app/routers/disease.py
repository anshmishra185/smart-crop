import hashlib
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import DiseaseDiagnosis
from ..schemas import DiseasePredictionResponse
from ..ml.disease_detector import disease_detector_model

router = APIRouter(prefix="/api/v1/predict", tags=["AI Disease Detection"])


def process_leaf_disease_diagnosis(contents: bytes, filename: str, db: Session) -> DiseasePredictionResponse:
    """Synchronous core logic for leaf disease analysis and database persistence."""
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Empty image payload received.")

    # Execute ML Inference
    result = disease_detector_model.analyze_image(contents, filename=filename)
    image_hash = hashlib.sha256(contents).hexdigest()

    # Store in Database
    try:
        diag_record = DiseaseDiagnosis(
            image_hash=image_hash,
            image_filename=filename,
            crop_name=result["crop_name"],
            disease_name=result["disease_name"],
            pathogen_type=result["pathogen_type"],
            confidence_score=result["confidence_score"],
            severity_level=result["severity_level"],
            affected_area_percentage=result["affected_area_percentage"],
            chemical_remedy="; ".join([f"{t['trade_name']} ({t['dosage_per_acre']})" for t in result["chemical_treatments"]]),
            biological_remedy="; ".join([f"{t['trade_name']} ({t['dosage_per_acre']})" for t in result["organic_treatments"]]),
            prevention_advice=" | ".join(result["preventive_measures"])
        )
        db.add(diag_record)
        db.commit()
    except Exception:
        db.rollback()

    return DiseasePredictionResponse(**result)


@router.post("/disease", response_model=DiseasePredictionResponse)
async def predict_leaf_disease(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Accepts crop leaf photograph, performs computer vision inference across 38 CIB&RC classes,
    stores diagnostic history in database, and returns prescription and treatment protocol.
    """
    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid image format (JPEG/PNG/WEBP).")

    contents = await file.read()
    return process_leaf_disease_diagnosis(contents, file.filename or "leaf.png", db)
