# To use this code, make sure you
#
#     import json
#
# and then, to convert JSON from a string, do
#
#     result = coffee_from_dict(json.loads(json_string))

from typing import Optional, Any, TypeVar, Type, cast


T = TypeVar("T")


def from_bool(x: Any) -> bool:
    assert isinstance(x, bool)
    return x


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


def to_class(c: Type[T], x: Any) -> dict:
    assert isinstance(x, c)
    return cast(Any, x).to_dict()


class CoffeeClass:
    """Do you want milk?"""
    milk: Optional[bool]
    """Do you want sugar?"""
    sugar: Optional[bool]

    def __init__(self, milk: Optional[bool], sugar: Optional[bool]) -> None:
        self.milk = milk
        self.sugar = sugar

    @staticmethod
    def from_dict(obj: Any) -> 'CoffeeClass':
        assert isinstance(obj, dict)
        milk = from_union([from_bool, from_none], obj.get("milk"))
        sugar = from_union([from_bool, from_none], obj.get("sugar"))
        return CoffeeClass(milk, sugar)

    def to_dict(self) -> dict:
        result: dict = {}
        result["milk"] = from_union([from_bool, from_none], self.milk)
        result["sugar"] = from_union([from_bool, from_none], self.sugar)
        return result


class Coffee:
    coffee: Optional[CoffeeClass]

    def __init__(self, coffee: Optional[CoffeeClass]) -> None:
        self.coffee = coffee

    @staticmethod
    def from_dict(obj: Any) -> 'Coffee':
        assert isinstance(obj, dict)
        coffee = from_union([CoffeeClass.from_dict, from_none], obj.get("coffee"))
        return Coffee(coffee)

    def to_dict(self) -> dict:
        result: dict = {}
        result["coffee"] = from_union([lambda x: to_class(CoffeeClass, x), from_none], self.coffee)
        return result


def coffee_from_dict(s: Any) -> Coffee:
    return Coffee.from_dict(s)


def coffee_to_dict(x: Coffee) -> Any:
    return to_class(Coffee, x)
