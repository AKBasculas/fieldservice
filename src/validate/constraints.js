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
