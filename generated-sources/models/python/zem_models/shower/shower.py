# To use this code, make sure you
#
#     import json
#
# and then, to convert JSON from a string, do
#
#     result = current_usage_from_dict(json.loads(json_string))
#     result = predicted_usage_from_dict(json.loads(json_string))

from enum import Enum
from typing import Optional, Any, List, Union, TypeVar, Type, cast, Callable


T = TypeVar("T")
EnumT = TypeVar("EnumT", bound=Enum)


def from_none(x: Any) -> Any:
    assert x is None
    return x


def from_union(fs, x):
    for f in fs:
        try:
            return f(x)
        except:
            pass
    assert False


def from_float(x: Any) -> float:
    assert isinstance(x, (float, int)) and not isinstance(x, bool)
    return float(x)


def to_enum(c: Type[EnumT], x: Any) -> EnumT:
    assert isinstance(x, c)
    return x.value


def to_float(x: Any) -> float:
    assert isinstance(x, float)
    return x


def to_class(c: Type[T], x: Any) -> dict:
    assert isinstance(x, c)
    return cast(Any, x).to_dict()


def from_list(f: Callable[[Any], T], x: Any) -> List[T]:
    assert isinstance(x, list)
    return [f(y) for y in x]


def from_int(x: Any) -> int:
    assert isinstance(x, int) and not isinstance(x, bool)
    return x


def from_bool(x: Any) -> bool:
    assert isinstance(x, bool)
    return x


def from_str(x: Any) -> str:
    assert isinstance(x, str)
    return x


class Unit(Enum):
    """The unit in which the usage is expressed"""
    JOULES = "Joules"
    K_WH = "kWh"


class UsageUsage:
    """The unit in which the usage is expressed"""
    unit: Optional[Unit]
    """The current usage"""
    value: Optional[float]

    def __init__(self, unit: Optional[Unit], value: Optional[float]) -> None:
        self.unit = unit
        self.value = value

    @staticmethod
    def from_dict(obj: Any) -> 'UsageUsage':
        assert isinstance(obj, dict)
        unit = from_union([Unit, from_none], obj.get("unit"))
        value = from_union([from_float, from_none], obj.get("value"))
        return UsageUsage(unit, value)

    def to_dict(self) -> dict:
        result: dict = {}
        result["unit"] = from_union([lambda x: to_enum(Unit, x), from_none], self.unit)
        result["value"] = from_union([to_float, from_none], self.value)
        return result


class Usage:
    usage: Optional[UsageUsage]

    def __init__(self, usage: Optional[UsageUsage]) -> None:
        self.usage = usage

    @staticmethod
    def from_dict(obj: Any) -> 'Usage':
        assert isinstance(obj, dict)
        usage = from_union([UsageUsage.from_dict, from_none], obj.get("usage"))
        return Usage(usage)

    def to_dict(self) -> dict:
        result: dict = {}
        result["usage"] = from_union([lambda x: to_class(UsageUsage, x), from_none], self.usage)
        return result


class CurrentUsageClass:
    current_usage: Optional[Usage]

    def __init__(self, current_usage: Optional[Usage]) -> None:
        self.current_usage = current_usage

    @staticmethod
    def from_dict(obj: Any) -> 'CurrentUsageClass':
        assert isinstance(obj, dict)
        current_usage = from_union([Usage.from_dict, from_none], obj.get("current_usage"))
        return CurrentUsageClass(current_usage)

    def to_dict(self) -> dict:
        result: dict = {}
        result["current_usage"] = from_union([lambda x: to_class(Usage, x), from_none], self.current_usage)
        return result


class PredictedUsage:
    """The predicted usage of the shower"""
    usages: List[Usage]

    def __init__(self, usages: List[Usage]) -> None:
        self.usages = usages

    @staticmethod
    def from_dict(obj: Any) -> 'PredictedUsage':
        assert isinstance(obj, dict)
        usages = from_list(Usage.from_dict, obj.get("usages"))
        return PredictedUsage(usages)

    def to_dict(self) -> dict:
        result: dict = {}
        result["usages"] = from_list(lambda x: to_class(Usage, x), self.usages)
        return result


def current_usage_from_dict(s: Any) -> Union[List[Any], bool, CurrentUsageClass, float, int, None, str]:
    return from_union([from_none, from_float, from_int, from_bool, from_str, lambda x: from_list(lambda x: x, x), CurrentUsageClass.from_dict], s)


def current_usage_to_dict(x: Union[List[Any], bool, CurrentUsageClass, float, int, None, str]) -> Any:
    return from_union([from_none, to_float, from_int, from_bool, from_str, lambda x: from_list(lambda x: x, x), lambda x: to_class(CurrentUsageClass, x)], x)


def predicted_usage_from_dict(s: Any) -> PredictedUsage:
    return PredictedUsage.from_dict(s)


def predicted_usage_to_dict(x: PredictedUsage) -> Any:
    return to_class(PredictedUsage, x)
