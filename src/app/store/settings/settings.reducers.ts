import { ActionReducer, createReducer, on } from '@ngrx/store';

import { changeLanguage, changeTheme } from './settings.actions';
import { initialState, SettingsState } from './settings.state';

export const settingsReducers: ActionReducer<SettingsState> = createReducer(
  initialState,
  on(changeLanguage, (state: SettingsState, { language }) => {
    return {
      ...state,
      language: language
    }
  }),
  on(changeTheme, (state: SettingsState, { theme }) => {
    return {
      ...state,
      theme: theme
    }
  })
);
