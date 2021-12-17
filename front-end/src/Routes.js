import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthRoute } from './auth/AuthRoute';
import { LogInPage } from './pages/Login';
import { SignUpPage } from './pages/SignUp';
import { UserInfoPage } from './pages/UserInfoPage';

export const Routes = () => {
    return (
        <Router>
            <Switch>
                <AuthRoute path="/" exact>
                    <UserInfoPage />
                </AuthRoute>
                <Route path="/login" exact>
                    <LogInPage />
                </Route>
                <Route path="/signup" exact>
                    <SignUpPage />
                </Route>
            </Switch>
        </Router>
    );
}