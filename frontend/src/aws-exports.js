import Amplify from 'aws-amplify';

export default Amplify.configure({
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: 'us-east-1:cee479db-79dd-4eb4-aeda-d5ab8769f13e',
    
    // REQUIRED - Amazon Cognito Region
    region: 'us-east-1',
    
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'us-east-1_8gkQh89gU',
    
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '5guu6qbbi36sgjr1fh4ohfub1g',
    
    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,
    
    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  }
});



