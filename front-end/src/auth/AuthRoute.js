import { Redirect, Route } from "react-router-dom";

export const AuthRoute = props => {
    const user = null;

    if (!user) return <Redirect to="/login" />

    return <Route {...props} />
}
