import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9EFEC",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    ...(Platform.OS === 'web' && {
      backgroundColor: "#ffffff",
      minHeight: '100vh',
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100%',
      height: '100%',
      overflow: 'auto'
    })
  },
  input: {
    width: "100%",
    height: 40,
    paddingHorizontal: 10,
    marginVertical: 10,
    marginBottom: 30,
    borderWidth: 0.2,
    borderBottomWidth: 2,
    ...(Platform.OS === 'web' && {
      height: '45px',
      padding: '12px 15px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '16px',
      backgroundColor: 'white',
      ':focus': {
        borderColor: '#16423C',
        outline: 'none',
        boxShadow: '0 0 0 2px rgba(22, 66, 60, 0.1)'
      }
    })
  },
  label: {
    alignSelf: "self-start",
    fontSize: 16,
    fontWeight: "350",
    color: "black",
  },
  formContainer: Platform.select({
    web: {
      width: '100%',
      maxWidth: '600px',
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      marginBottom: '20px',
    },
    default: {}
  }),
  button: {
    backgroundColor: "#16423C",
    padding: 15,
    borderRadius: 30,
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      padding: '15px 30px',
      width: '200px',
      height: '50px',
      marginTop: 20,
    })
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "350",
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  tab: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#6A9C89',
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      ':hover': {
        backgroundColor: '#5a8c79'
      }
    })
  },
  activeTab: {
    backgroundColor: '#16423C',
  },
  tabText: {
    color: 'white',
    fontWeight: '500',
  },
  resultContainer: {
    marginTop: 40,
    padding: 15,
    backgroundColor: '#16423C',
    borderRadius: 15,
    width: '80%',
    ...(Platform.OS === 'web' && {
      maxWidth: '700px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '20px',
      marginTop: '30px',
      marginBottom: '20px',
    })
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 10,
    ...(Platform.OS === 'web' && {
      fontFamily: 'monospace',
      lineHeight: '1.5',
    })
  }
});

export default styles;