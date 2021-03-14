import React from 'react';
import { GoogleLogout } from 'react-google-login';

const clientId =
  '1089484993213-m2egvehin0lt0lj5cjgqrut9csq7b8oq.apps.googleusercontent.com';

function Logout(props) {
  const onSuccess = () => {
    console.log('Logout made successfully');
    alert('Logout made successfully ✌');
    props.handleLogin(false);
  };

  return (
    <div>
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      ></GoogleLogout>
    </div>
  );
}

export default Logout;