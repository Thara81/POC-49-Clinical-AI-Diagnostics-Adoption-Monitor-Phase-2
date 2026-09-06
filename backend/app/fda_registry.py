"""Compatibility wrapper for the real FDA registry module.

This project uses the correctly spelled module name in the API router, but the
historical dataset file and legacy module were misspelled as `fda_registery`.
The implementation lives in the canonical module and is re-exported here so both
import styles work.
"""

from .fda_registery import (
    DATA_DIR,
    FDA_REGISTRY_PATH,
    _raw,
    get_fda_devices,
    get_fda_registry_full,
    get_source_info,
)

__all__ = [
    "DATA_DIR",
    "FDA_REGISTRY_PATH",
    "_raw",
    "get_fda_devices",
    "get_fda_registry_full",
    "get_source_info",
]
