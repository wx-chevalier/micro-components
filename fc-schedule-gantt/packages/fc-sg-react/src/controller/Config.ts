const defValues = {
  header: {
    top: {
      style: {
        backgroundColor: '#333333',
        fontSize: 10,
        color: 'white',
        textAlign: 'center'
      }
    },
    middle: {
      style: {
        backgroundColor: 'chocolate'
      },
      selectedStyle: {
        backgroundColor: '#b13525',
        fontWeight: 'bold'
      }
    },
    bottom: {
      style: {
        background: 'grey',
        color: 'white',
        fontSize: 9
      },
      selectedStyle: {
        backgroundColor: '#b13525',
        fontWeight: 'bold'
      }
    }
  },
  taskList: {
    title: {
      label: 'Projects',
      style: {
        backgroundColor: '#333333',
        borderBottom: 'solid 1px silver',
        color: 'white',
        textAlign: 'center'
      }
    },
    task: {
      style: {
        backgroundColor: '#fbf9f9'
      }
    },
    verticalSeparator: {
      style: {
        backgroundColor: '#333333'
      },
      grip: {
        style: {
          backgroundColor: '#cfcfcd'
        }
      }
    }
  },
  dataViewPort: {
    rows: {
      style: {
        backgroundColor: '#fbf9f9',
        borderBottom: 'solid 0.5px #cfcfcd'
      }
    },
    task: {
      showLabel: false,

      style: {
        position: 'absolute',
        borderRadius: 14,
        color: 'white',
        textAlign: 'center',
        backgroundColor: 'grey'
      },
      selectedStyle: {
        position: 'absolute',
        borderRadius: 14,
        border: 'solid 1px #ff00fa',
        color: 'white',
        textAlign: 'center',
        backgroundColor: 'grey'
      }
    }
  },
  links: {
    color: 'black',
    selectedColor: '#ff00fa'
  }
};

/** 配置中心 */
export class Config {
  data: any;

  constructor() {
    this.data = defValues;
  }

  load = (values: any) => {
    this.data = {};
    if (values) this.populate(values, defValues, this.data);
    else this.data = defValues;
  };

  populate(values, defValues, final) {
    if (!this.isObject(defValues)) return;
    for (let key in defValues) {
      if (!values[key]) {
        //if not exits
        final[key] = defValues[key];
      } else {
        //if it does
        final[key] = values[key];
        this.populate(values[key], defValues[key], final[key]);
      }
    }
  }
  isObject(value) {
    if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number')
      return false;
    return true;
  }

  get values() {
    return this.data;
  }
}

export const config = new Config();
