import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

const AppInfo = require("./app.json").expo;

const IN = { First: "", Second: "" };
let Status = "ОЖИДАНИЕ";
console.log("START");
export default function App() {
	const [hasPermission, setHasPermission] = useState(null);
	const [scanned, setScanned] = useState("");
	const [fontsLoaded, setFontsLoaded] = useState(false);

	const LoadFonts = async () => {
		console.log(fontsLoaded);
		await Font.loadAsync({
			"Ubuntu-Mono": require("./assets/fonts/UbuntuMono/UbuntuMono-Regular.ttf"),
			"Roboto-Mono": require("./assets/fonts/RobotoMono/RobotoMono-Regular.ttf"),
		});

		setFontsLoaded(true);
	};

	useEffect(() => {
		(async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === "granted");
		})();
	}, []);

	if (!fontsLoaded) {
		LoadFonts();
		return <AppLoading />;
		// return LoadingScreen();
	}

	if (hasPermission === null) {
		return <Text>Requesting for camera permission</Text>;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}

	const ScanHandler = ({ type, data }) => {
		let nom = data.match(/\d{15}/g);
		if (nom) nom = nom.toString();
		else alert("Invalid QRCode!");
		if (nom && data.toString() !== scanned.toString()) {
			if (IN.First === "") {
				IN.First = nom;
			} else if (IN.Second === "" || IN.Second !== IN.First) {
				IN.Second = nom;
			}

			if (IN.First !== "" && IN.Second !== "")
				if (IN.Second === IN.Second) {
					styles.compInfo.backgroundColor = "#00a";

					Status = "НАЙДЕНО!";
				} else {
					styles.compInfo.backgroundColor = "#aa0";
					Status = "ОЖИДАНИЕ";
				}
		}
		setScanned(data);
	};

	const Reset = () => {
		IN.First = "dede";
		IN.Second = "dede";
		setScanned("null");
	};

	function LoadingScreen() {
		return (
			<View style={styles.container}>
				<Text>{AppInfo.name}</Text>
				<Text>VERSION: {AppInfo.version}</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.infoBox}>
				<View style={styles.Noms}>
					<Text style={{ fontFamily: "Ubuntu-Mono" }}>
						{"First  IN: " + IN.First}
					</Text>
					<Text style={{ fontFamily: "Ubuntu-Mono" }}>
						{"Second IN: " + IN.Second}
					</Text>
				</View>

				<Text style={styles.compInfo}>{Status}</Text>
			</View>

			<BarCodeScanner
				onBarCodeScanned={ScanHandler}
				style={{ width: "90%", height: "80%" }}
			></BarCodeScanner>

			<Button title="Reset" onPress={Reset} />
			<Text>SESION: {Math.floor(Math.random() * 10000)}</Text>

			<StatusBar style="auto" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		flex: 1,
	},
	infoBox: {
		display: "flex",
		alignItems: "stretch",
		width: "100%",
		flexDirection: "row",
	},
	compInfo: {
		width: "50%",
		backgroundColor: "#aa0",
		textAlign: "center",
		fontSize: 30,
		justifyContent: "center",
	},
	Noms: {
		width: "50%",
	},
});
