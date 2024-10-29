import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Keep center alignment vertically
    alignItems: 'center',     // Keep center alignment horizontally
    backgroundColor: '#f4f4f8',  // A light grey background
    padding: 20,               // Padding around the edges
  },
  title: {
    fontSize: 26,              // Slightly larger font size
    color: '#333',             // Darker text color for better readability
    fontWeight: 'bold',        // Make the title bold
    marginBottom: 30,          // Increase space below the title
  },
  button: {
    marginVertical: 12,        // Slightly more vertical space between buttons
    paddingVertical: 15,       // Thicker buttons for a better tactile feel
    paddingHorizontal: 30,     // Wider buttons
    backgroundColor: '#007bff', // A vibrant blue background color
    borderRadius: 8,           // Rounded corners for buttons
    elevation: 3,              // Drop shadow for elevation effect (Android)
    shadowColor: '#000',       // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow direction
    shadowOpacity: 0.25,       // Shadow opacity
    shadowRadius: 3.84,        // Shadow blur radius
  },
  linkText: {
    color: '#fff',             // Keep text white for contrast
    fontSize: 20,              // Larger font size
    fontWeight: '500',         // Medium weight for readability
  },
});
