import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9EFEC",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    height: 40,
    paddingHorizontal: 10,
    marginVertical: 10,
    marginBottom: 30,
    borderWidth: 0.2,
    borderBottomWidth: 2,
  },
  label: {
    alignSelf: "self-start",
    fontSize: 16,
    fontWeight: "350",
    color: "black",
  },
  button: {
    backgroundColor: "#16423C",
    padding: 15,
    borderRadius: 30,
    width: "40%",
    alignItems: "center",
    marginTop: 20,
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
  },
  activeTab: {
    backgroundColor: 'black',
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
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 10,
  },
});
  
export default styles;