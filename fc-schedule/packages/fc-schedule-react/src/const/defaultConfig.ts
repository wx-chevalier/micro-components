import { UiConfigProps } from './../controller/UiConfig';

export const defaultConfig: UiConfigProps = {
  showController: true,
  disableEditableName: false,
  disableLink: false,

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
        backgroundColor: 'rgb(207, 207, 205, 0.5)'
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
