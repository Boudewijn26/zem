# This code parses date/times, so please
#
#     pip install python-dateutil
#
# To use this code, make sure you
#
#     import json
#
# and then, to convert JSON from a string, do
#
#     result = person_from_dict(json.loads(json_string))

from typing import Optional, Any, TypeVar, Type, cast
from datetime import datetime
import dateutil.parser


T = TypeVar("T")


def from_str(x: Any) -> str:
    assert isinstance(x, str)
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


def from_int(x: Any) -> int:
    assert isinstance(x, int) and not isinstance(x, bool)
    return x


def from_datetime(x: Any) -> datetime:
    return dateutil.parser.parse(x)


def from_bool(x: Any) -> bool:
    assert isinstance(x, bool)
    return x


def to_class(c: Type[T], x: Any) -> dict:
    assert isinstance(x, c)
    return cast(Any, x).to_dict()


class Address:
    """Address"""
    """Additional information house number"""
    additional: Optional[str]
    """City"""
    city: Optional[str]
    """Country"""
    country: Optional[str]
    """House number"""
    number: Optional[int]
    """Street name"""
    street: Optional[str]

    def __init__(self, additional: Optional[str], city: Optional[str], country: Optional[str], number: Optional[int], street: Optional[str]) -> None:
        self.additional = additional
        self.city = city
        self.country = country
        self.number = number
        self.street = street

    @staticmethod
    def from_dict(obj: Any) -> 'Address':
        assert isinstance(obj, dict)
        additional = from_union([from_str, from_none], obj.get("Additional"))
        city = from_union([from_str, from_none], obj.get("City"))
        country = from_union([from_str, from_none], obj.get("Country"))
        number = from_union([from_int, from_none], obj.get("Number"))
        street = from_union([from_str, from_none], obj.get("street"))
        return Address(additional, city, country, number, street)

    def to_dict(self) -> dict:
        result: dict = {}
        result["Additional"] = from_union([from_str, from_none], self.additional)
        result["City"] = from_union([from_str, from_none], self.city)
        result["Country"] = from_union([from_str, from_none], self.country)
        result["Number"] = from_union([from_int, from_none], self.number)
        result["street"] = from_union([from_str, from_none], self.street)
        return result


class Person:
    """Address"""
    address: Optional[Address]
    """Birth day"""
    birth_date: Optional[datetime]
    """First name"""
    first_name: Optional[str]
    """Id"""
    id: Optional[str]
    """Whether the record is deleted"""
    is_deleted: bool
    """Last name"""
    last_name: Optional[str]
    """Last update"""
    updated_at: datetime

    def __init__(self, address: Optional[Address], birth_date: Optional[datetime], first_name: Optional[str], id: Optional[str], is_deleted: bool, last_name: Optional[str], updated_at: datetime) -> None:
        self.address = address
        self.birth_date = birth_date
        self.first_name = first_name
        self.id = id
        self.is_deleted = is_deleted
        self.last_name = last_name
        self.updated_at = updated_at

    @staticmethod
    def from_dict(obj: Any) -> 'Person':
        assert isinstance(obj, dict)
        address = from_union([Address.from_dict, from_none], obj.get("address"))
        birth_date = from_union([from_datetime, from_none], obj.get("birthDate"))
        first_name = from_union([from_str, from_none], obj.get("firstName"))
        id = from_union([from_str, from_none], obj.get("id"))
        is_deleted = from_bool(obj.get("isDeleted"))
        last_name = from_union([from_str, from_none], obj.get("lastName"))
        updated_at = from_datetime(obj.get("updatedAt"))
        return Person(address, birth_date, first_name, id, is_deleted, last_name, updated_at)

    def to_dict(self) -> dict:
        result: dict = {}
        result["address"] = from_union([lambda x: to_class(Address, x), from_none], self.address)
        result["birthDate"] = from_union([lambda x: x.isoformat(), from_none], self.birth_date)
        result["firstName"] = from_union([from_str, from_none], self.first_name)
        result["id"] = from_union([from_str, from_none], self.id)
        result["isDeleted"] = from_bool(self.is_deleted)
        result["lastName"] = from_union([from_str, from_none], self.last_name)
        result["updatedAt"] = self.updated_at.isoformat()
        return result


def person_from_dict(s: Any) -> Person:
    return Person.from_dict(s)


def person_to_dict(x: Person) -> Any:
    return to_class(Person, x)
