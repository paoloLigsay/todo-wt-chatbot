from dataclasses import dataclass
from models.user import User
from constants.scim import list_response_schema

@dataclass
class ListResponse:
  list: list
  start_index: int = 1
  count: int = None
  total_results: int = 0

  def to_scim_resource_list(self):
    resources = []
    for item in self.list:
      resources.append(User(item).to_scim_resource())

    rv = {
      "schemas": [list_response_schema],
      "totalResults": self.total_results,
      "startIndex": self.start_index,
      "Resources": resources,
    }

    if self.count:
      rv["itemsPerPage"] = self.count
    return rv
