import os
import yaml
import pytest

ONTOLOGY_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ontology")

def test_emotions_yaml_valid():
    path = os.path.join(ONTOLOGY_DIR, "emotions.yaml")
    assert os.path.exists(path), f"Missing {path}"
    with open(path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    assert isinstance(data, dict)
    assert "negative" in data
    assert "positive" in data
    assert "sadness" in data["negative"]
    assert "grief" in data["negative"]
    assert "guilt" in data["negative"]
    assert "shame" in data["negative"]
    assert "peace" in data["positive"]
    assert "hope" in data["positive"]

def test_situations_yaml_valid():
    path = os.path.join(ONTOLOGY_DIR, "situations.yaml")
    assert os.path.exists(path), f"Missing {path}"
    with open(path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    assert isinstance(data, dict)
    for category in ["loss", "relationships", "self", "worship", "worldly_pressure"]:
        assert category in data, f"Missing category {category} in situations.yaml"

def test_safety_states_yaml_valid():
    path = os.path.join(ONTOLOGY_DIR, "safety_states.yaml")
    assert os.path.exists(path), f"Missing {path}"
    with open(path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    assert isinstance(data, dict)
    assert "critical" in data
    assert "self_harm" in data["critical"]
    assert "suicidal_ideation" in data["critical"]

def test_spiritual_states_yaml_valid():
    path = os.path.join(ONTOLOGY_DIR, "spiritual_states.yaml")
    assert os.path.exists(path), f"Missing {path}"
    with open(path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    assert isinstance(data, dict)
    assert "weak_iman" in data or any("weak_iman" in str(v) for v in data.values())

def test_relationships_yaml_valid():
    path = os.path.join(ONTOLOGY_DIR, "relationships.yaml")
    assert os.path.exists(path), f"Missing {path}"
    with open(path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    assert isinstance(data, (dict, list))
