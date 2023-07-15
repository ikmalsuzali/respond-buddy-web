import { defineStore } from 'pinia';

export enum SnackbarType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

export const useSnackbarStore = defineStore('SnackbarStore', {
  state: () => ({
    isSnackbarActive: false,
    title: '',
    description: '',
    type: '',
    action: {
      text: '',
      handler: () => {},
    }
  }),

  actions: {
    showSnackbar({title, description, type, action}: {title: string, description: string | undefined, type: SnackbarType, action: any}) {
      this.isSnackbarActive = true;
      this.title = title;
      this.description = description;
      this.type = type;
      this.action = {
        text: action.text,
        handler: action.handler,
      };
    }

  
  },
})
