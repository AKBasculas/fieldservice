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
  contacts: {
    type: "array"
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
const DEVICE = {
  TYPE: {
    type: {
      type: "string",
      presence: {
        allowEmpty: false
      }
    }
  },
  BRAND: {
    type: {
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
    }
  },
  MODEL: {
    type:{
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
    model: {
      type: "string",
      presence: {
        allowEmpty: false
      }
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
