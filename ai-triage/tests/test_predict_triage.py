import pytest
from fastapi.testclient import TestClient



from src import api as ai_module


class FakeModel:
    def __init__(self, positive_probability):
        self.positive_probability = positive_probability

    def predict_proba(self, patient_df):
        return [[1 - self.positive_probability, self.positive_probability]]


class FailingModel:
    def predict_proba(self, patient_df):
        raise RuntimeError("Eroare model AI")


@pytest.fixture
def mockedPipeline(monkeypatch):
    monkeypatch.setattr(
        ai_module,
        "normalize_patient_input",
        lambda patient: patient,
    )

    monkeypatch.setattr(
        ai_module,
        "prepare_single_patient",
        lambda patient: {"mocked": True},
    )


def testPredictTriageReturnsYellowForUrgentLowRedProbability(monkeypatch, mockedPipeline):
    monkeypatch.setattr(
        ai_module,
        "apply_safety_rules",
        lambda patient: (None, []),
    )

    result = ai_module.predict_triage(
        {"pulse": 110, "painScale": 7},
        FakeModel(0.80),
        FakeModel(0.20),
        FakeModel(0.10),
    )

    assert result["decizie_etapa_1"] == "urgent"
    assert result["predictie_finala"] == "galben"
    assert result["sursa_decizie"] == "model_ierarhic"
    assert result["prob_urgent"] == 0.80
    assert result["prob_red"] == 0.20


def testPredictTriageReturnsGreenForNonUrgentGreenPatient(monkeypatch, mockedPipeline):
    monkeypatch.setattr(
        ai_module,
        "apply_safety_rules",
        lambda patient: (None, []),
    )

    result = ai_module.predict_triage(
        {"pulse": 75, "spo2": 99},
        FakeModel(0.20),
        FakeModel(0.10),
        FakeModel(0.90),
    )

    assert result["decizie_etapa_1"] == "nonurgent"
    assert result["predictie_finala"] == "verde"
    assert result["sursa_decizie"] == "model_ierarhic"
    assert result["prob_urgent"] == 0.20
    assert result["prob_green"] == 0.90


def testPredictTriageReturnsConsultForNonUrgentLowGreenProbability(monkeypatch, mockedPipeline):
    monkeypatch.setattr(
        ai_module,
        "apply_safety_rules",
        lambda patient: (None, []),
    )

    result = ai_module.predict_triage(
        {"pulse": 82, "spo2": 97},
        FakeModel(0.20),
        FakeModel(0.10),
        FakeModel(0.20),
    )

    assert result["decizie_etapa_1"] == "nonurgent"
    assert result["predictie_finala"] == "consult"
    assert result["sursa_decizie"] == "model_ierarhic"
    assert result["prob_urgent"] == 0.20
    assert result["prob_green"] == 0.20


def testPredictTriageRaisesExceptionWhenModelFails(monkeypatch, mockedPipeline):
    monkeypatch.setattr(
        ai_module,
        "apply_safety_rules",
        lambda patient: (None, []),
    )

    with pytest.raises(RuntimeError, match="Eroare model AI"):
        ai_module.predict_triage(
            {"pulse": 100},
            FailingModel(),
            FakeModel(0.10),
            FakeModel(0.10),
        )


def testPredictEndpointReturnsValidResponse(monkeypatch):
    client = TestClient(ai_module.app)

    expected_response = {
        "decizie_etapa_1": "urgent",
        "predictie_finala": "galben",
        "prob_urgent": 0.82,
        "prob_red": 0.30,
        "reguli_siguranta_aplicate": [],
        "sursa_decizie": "model_ierarhic",
    }

    monkeypatch.setattr(
        ai_module,
        "predict_triage",
        lambda patient, model_urgent, model_red, model_green: expected_response,
    )

    response = client.post(
        "/predict",
        json={
            "age": 36,
            "pulse": 118,
            "spo2": 94,
            "painScale": 7,
        },
    )

    assert response.status_code == 200
    assert response.json() == expected_response


def testPredictEndpointRejectsInvalidBody():
    client = TestClient(ai_module.app)

    response = client.post(
        "/predict",
        json=["invalid", "payload"],
    )

    assert response.status_code == 422