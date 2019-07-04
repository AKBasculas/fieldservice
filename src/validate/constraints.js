//Constraints
//Register
const REGISTER = {
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

//Branch
const BRANCH = {
  name: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  }
}

//Service
const SERVICE = {
  name: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  }
}

//Company
const COMPANY = {
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
    presence: {
      allowEmpty: false
    }
  }
}

//Contact
const CONTACT = {
  name: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  },
  phone: {
    type: "string"
  }
}

//Device
const CREATE_DEVICE_TYPE = {
  name: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  }
}
const CREATE_DEVICE_BRAND = {
  name: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  }
}
const CREATE_DEVICE_MODEL = {
  name: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  },
  brand: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  },
  type: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  }
}

const OWNERSHIP = {
  name: {
    type: "string",
    presence: {
      allowEmpty: false
    }
  }
}

const PERSON = {
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
    presence: {
      allowEmpty: false
    }
  }
}

const VEHICLE = {
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
    presence: {
      allowEmpty: false
    }
  }
}

const ENTRY = {
  ENTRY: {
    branch: {
      type: "string",
      presence: {
        allowEmpty: false
      }
    },
    service: {
      type: "string",
      presence: {
        allowEmpty: false
      }
    },
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

const constraints = {
  BRANCH,
  SERVICE,
  COMPANY,
  CONTACT,
  REGISTER,
  OWNERSHIP,
  PERSON,
  VEHICLE,
  ENTRY,
  ADD_COMPANY_CONTACTS,
  CREATE_DEVICE_TYPE,
  CREATE_DEVICE_BRAND,
  CREATE_DEVICE_MODEL
};
export default constraints;
