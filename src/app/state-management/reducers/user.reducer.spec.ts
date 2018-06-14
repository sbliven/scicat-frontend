import { userReducer } from './user.reducer';
import { initialUserState, UserState} from '../state/user.store';
import * as userActions from '../actions/user.actions';
import { User, MessageType, Message, Settings, AccessGroup } from '../models';
import { initialDatasetState } from '../state/datasets.store';

describe('DatasetsReducer', () => {

    it('should set currentUser', () => {
        const user: User = {
            "realm": '',
            "username": '',
            "email": '',
            "emailVerified": true,
            "id": '',
            "password": '',
            accessTokens: [],
            identities: [],
            credentials: []
        };
        const action = new userActions.RetrieveUserCompleteAction(user);
        const state = userReducer(initialUserState, action);
        expect(state.currentUser).toEqual(user);
    })

    it('should set loading to false after login complete', () => {
        const user: User = {
            "realm": '',
            "username": '',
            "email": '',
            "emailVerified": true,
            "id": '',
            "password": '',
            accessTokens: [],
            identities: [],
            credentials: []
        };
        const action = new userActions.LoginCompleteAction(user);
        const state = userReducer(initialUserState, action);
        expect(state.loading).toEqual(false);
    })

    it('should set currentUser', () => {
        const user: User = {
            "realm": '',
            "username": '',
            "email": '',
            "emailVerified": true,
            "id": '',
            "password": '',
            accessTokens: [],
            identities: [],
            credentials: []
        };
        const action = new userActions.LoginCompleteAction({user: user});
        const state = userReducer(initialUserState, action);
        expect(state.currentUser).toEqual(user);
    })

    it('should set email', () => {
        const email = 'abc'
        const action = new userActions.AccessUserEmailCompleteAction(email);
        const state = userReducer(initialUserState, action);
        expect(state.email).toEqual(email);
    })

    it('should set loading to false after login failed complete', () => {
        const action = new userActions.LoginFailedAction();
        const state = userReducer(initialUserState, action);
        expect(state.loading).toEqual(false);
    })
    
    it('should set message', () => {
        const message :  Message = {
            content: '',
            type: MessageType.Success,
            duration: 10000
          };
        const action = new userActions.ShowMessageAction(message);
        const state = userReducer(initialUserState, action);
        expect(state.message).toEqual(message);
    })

    it('should set message', () => {
        const action = new userActions.ClearMessageAction();
        const state = userReducer(initialUserState, action);
        expect(state.message).toEqual(initialUserState.message);
    })

    it('should set settings', () => {
        const setting: Settings ={
            tapeCopies: '',
            datasetCount: 0,
            jobCount: 0,
            darkTheme: false
          };
        const action = new userActions.SaveSettingsAction(setting);
        const state = userReducer(initialUserState, action);
        expect(state.settings).toEqual(setting);
    })

    it('should set currentUserGroups', () => {
        const data = {
            "description": '',
            "member": [],
            "memberOf": [],
        }
        const current = [
            new AccessGroup({...data, sAMAccountName: 'sAMAccountName 1'}), 
            new AccessGroup({...data, sAMAccountName: 'sAMAccountName 2'}),
            new AccessGroup({...data, sAMAccountName: 'sAMAccountName 3'})
        ];
        const action = new userActions.AddGroupsCompleteAction(current);
        const state = userReducer(initialUserState, action);
        expect(state.currentUserGroups.length).toEqual(current.length)
    })

    it('should set loading to false after login complete', () => {
        const info = {
            username: '',
            password: '',
            rememberMe: true,
        }
        const action = new userActions.LoginAction(info);
        const state = userReducer(initialUserState, action);
        expect(state.loading).toEqual(true);
    })
})