//Constraints
//Create user
const CREATE_USER = {
  username: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  },
  password: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  },
  role: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  },
  branches: {
    type: "array",
    presence: {
      allowEmpty: false
    }
  }
}

//Create branch
const CREATE_BRANCH = {
  name: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  }
}

//Create service
const CREATE_SERVICE = {
  name: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  }
}

//Create company
const CREATE_COMPANY = {
  name: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  },
  address: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  },
  branch: {
    type: "string",
    length: {
      is: 24
    },
    presence: {
      allowEmpty: false
    }
  }
}

//Create contact
const CREATE_CONTACT = {
  name: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  },
  phone: {
    type: "string"
  },
  company: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  }
}

//Create device type
const CREATE_DEVICE_TYPE = {
  name: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  }
}

//Create device brand
const CREATE_DEVICE_BRAND = {
  name: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  }
}

//Create device model
const CREATE_DEVICE_MODEL = {
  name: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  },
  brand: {
    type: "string",
    length: {
      is: 24
    },
    presence: {
      allowEmpty: false
    }
  },
  type: {
    type: "string",
    length: {
      is: 24
    },
    presence: {
      allowEmpty: false
    }
  }
}

//Create ownership
const CREATE_OWNERSHIP = {
  name: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  }
}

//Create person
const CREATE_PERSON = {
  name: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  },
  number: {
    type: "integer",
    presence: {
      allowEmpty: false
    }
  },
  branch: {
    type: "string",
    length: {
      is: 24
    },
    presence: {
      allowEmpty: false
    }
  }
}

//Create vehicle
const CREATE_VEHICLE = {
  name: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  },
  alias: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  },
  branch: {
    type: "string",
    length: {
      is: 24
    },
    presence: {
      allowEmpty: false
    }
  }
}

//Create entry
const CREATE_ENTRY = {
  ENTRY: {
    branch: {
      type: "string",
      length: {
        is: 24
      },
      presence: {
        allowEmpty: false
      }
    },
    service: {
      type: "string",
      length: {
        is: 24
      },
      presence: {
        allowEmpty: false
      }
    },
    company: {
      type: "string",
      length: {
        is: 24
      },
      presence: {
        allowEmpty: false
      }
    },
    contacts: {
      type: "array",
      presence: {
        allowEmpty: false
      }
    },
    devicemodels: {
      type: "array",
      presence: {
        allowEmpty: false
      }
    },
    periods: {
      type: "array",
      presence: {
        allowEmpty: false
      }
    },
    cost: {
      type: "number",
      presence: {
        allowEmpty: false
      }
    },
    ownership: {
      type: "string",
      length: {
        is: 24
      },
      presence: {
        allowEmpty: false
      }
    },
    comments: {
      type: "string",
      presence: {
        allowEmpty: false
      }
    }
  },
  PERIOD: {
    starttime: {
      datetime: true
    },
    endtime: {
      datetime: true
    },
    people: {
      type: "array",
      presence: {
        allowEmpty: false
      }
    },
    vehicles: {
      type: "array",
      presence: {
        allowEmpty: false
      }
    }
  }
}

const ADD_COMPANY_CONTACTS = {
  company: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  },
  contacts: {
    type: "array",
    presence: {
      allowEmpty: false
    }
  }
}

const READ_BRANCHES = {
  name: {
    type: "string",
    presence: true
  }
}

const READ_SERVICES = {
  name: {
    type: "string",
    presence: true
  }
}

const READ_CONTACTS = {
  name: {
    type: "string",
    presence: true
  }
}

const READ_COMPANIES = {
  name: {
    type: "string",
    presence: true
  }
}

const READ_DEVICE_TYPES = {
  name: {
    type: "string",
    presence: true
  }
}

const READ_DEVICE_BRANDS = {
  name: {
    type: "string",
    presence: true
  }
}

const READ_DEVICE_MODELS = {
  name: {
    type: "string",
    presence: true
  }
}

const ID = {
  type: "string",
  length: {
    is: 24
  }
}

const constraints = {
  ID,
  CREATE_BRANCH,
  CREATE_SERVICE,
  CREATE_COMPANY,
  CREATE_CONTACT,
  CREATE_USER,
  CREATE_OWNERSHIP,
  CREATE_PERSON,
  CREATE_VEHICLE,
  CREATE_ENTRY,
  ADD_COMPANY_CONTACTS,
  CREATE_DEVICE_TYPE,
  CREATE_DEVICE_BRAND,
  CREATE_DEVICE_MODEL,
  READ_BRANCHES,
  READ_SERVICES,
  READ_CONTACTS,
  READ_COMPANIES,
  READ_DEVICE_TYPES,
  READ_DEVICE_BRANDS,
  READ_DEVICE_MODELS
};
export default constraints;
