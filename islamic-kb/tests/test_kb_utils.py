import os
import sys
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "scripts"))
from utils import normalize_arabic

def test_normalize_arabic_strips_tashkeel():
    # With harakat: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
    vocalized = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
    normalized = normalize_arabic(vocalized)
    # Shouldn't contain fatha, kasra, damma, shaddah, sukoon
    assert "ِ" not in normalized
    assert "ّ" not in normalized
    assert "ْ" not in normalized

def test_normalize_arabic_hamza():
    assert normalize_arabic("إيمان") == "ايمان"
    assert normalize_arabic("أحمد") == "احمد"
    assert normalize_arabic("آمن") == "امن"

def test_normalize_arabic_endings():
    # ta marbuta to ha
    assert normalize_arabic("رحمة") == "رحمه"
    # alif maqsura to ya
    assert normalize_arabic("هدى") == "هدي"

def test_normalize_empty():
    assert normalize_arabic("") == ""
    assert normalize_arabic(None) == ""
