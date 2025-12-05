// App.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { ref, push, set, onValue, update, remove } from "firebase/database";
import { db } from "./firebaseConfig";

import HomeScreen from "./screens/HomeScreen";
import ReportFormScreen from "./screens/ReportFormScreen";
import ReportListScreen from "./screens/ReportListScreen";
import MapScreen from "./screens/MapScreen";

import { FormDataType, Report } from "./types/ReportTypes";

type Menu = "home" | "report" | "list" | "map";

const INITIAL_LAT = -7.7956;
const INITIAL_LNG = 110.3695;

export default function App() {
  const [menu, setMenu] = useState<Menu>("home");
  const [reports, setReports] = useState<Report[]>([]);
  const [editing, setEditing] = useState<Report | null>(null);

  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    description: "",
    category: "jalan",
    latitude: INITIAL_LAT,
    longitude: INITIAL_LNG,
    address: "",
    photoUrl: undefined,
  });

  /* =====================================
        LOAD DATA DARI FIREBASE
     ===================================== */
  useEffect(() => {
    const reportsRef = ref(db, "reports");

    return onValue(reportsRef, (snapshot) => {
      const data = snapshot.val();
      console.log("DATA MASUK:", data);

      if (!data) {
        setReports([]);
        return;
      }

      const list: Report[] = Object.entries(data).map(([id, value]: any) => ({
        id,
        ...value,
        timestamp: value.timestamp ?? new Date().toISOString(),
      }));

      list.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setReports(list);
    });
  }, []);

  /* RESET FORM */
  const resetForm = () => {
    setEditing(null);
    setFormData({
      title: "",
      description: "",
      category: "jalan",
      latitude: INITIAL_LAT,
      longitude: INITIAL_LNG,
      address: "",
      photoUrl: undefined,
    });
  };

  /* =====================================
              SUBMIT LAPORAN
     ===================================== */
  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      Alert.alert("Validasi", "Judul dan Deskripsi wajib diisi.");
      return;
    }

    const data = {
      ...formData,
      timestamp: editing?.timestamp ?? new Date().toISOString(),
    };

    try {
      if (editing) {
        await update(ref(db, "reports/" + editing.id), data);
        Alert.alert("Berhasil", "Laporan berhasil diperbarui!");
      } else {
        const newRef = push(ref(db, "reports"));
        await set(newRef, data);
        Alert.alert("Berhasil", "Laporan baru ditambahkan!");
      }

      resetForm();
      setMenu("list");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Gagal menyimpan data.");
    }
  };

  /* EDIT */
  const handleEdit = (report: Report) => {
    setEditing(report);
    setFormData({
      title: report.title,
      description: report.description,
      category: report.category,
      latitude: report.latitude,
      longitude: report.longitude,
      address: report.address,
      photoUrl: report.photoUrl,
    });
    setMenu("report");
  };

  /* DELETE */
  const handleDelete = async (id: string) => {
    await remove(ref(db, "reports/" + id));
    Alert.alert("Berhasil", "Laporan dihapus");
  };

  /* =====================================
                 RENDER
     ===================================== */
  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LAPORin</Text>
        <Text style={styles.headerSub}>Sistem Pelaporan Infrastruktur</Text>
      </View>

      {/* MAIN CONTENT */}
      <View style={{ flex: 1 }}>
        {menu === "home" && (
          <HomeScreen
            reports={reports}
            onGoReport={() => setMenu("report")}
            onGoList={() => setMenu("list")}
          />
        )}

        {menu === "report" && (
          <ReportFormScreen
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            editing={editing}
            onCancelEdit={resetForm}
          />
        )}

        {menu === "list" && (
          <ReportListScreen
            reports={reports}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {menu === "map" && <MapScreen reports={reports} />}
      </View>

      {/* NAVIGATION BAR */}
      <View style={styles.nav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setMenu("home")}
        >
          <Ionicons
            name="home"
            size={24}
            color={menu === "home" ? "#2563EB" : "gray"}
          />
          <Text style={menu === "home" ? styles.navTextActive : styles.navText}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setMenu("report")}
        >
          <Ionicons
            name="add-circle"
            size={24}
            color={menu === "report" ? "#2563EB" : "gray"}
          />
          <Text
            style={menu === "report" ? styles.navTextActive : styles.navText}
          >
            Lapor
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setMenu("list")}
        >
          <Ionicons
            name="list"
            size={24}
            color={menu === "list" ? "#2563EB" : "gray"}
          />
          <Text style={menu === "list" ? styles.navTextActive : styles.navText}>
            Daftar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setMenu("map")}>
          <Ionicons
            name="map"
            size={24}
            color={menu === "map" ? "#2563EB" : "gray"}
          />
          <Text style={menu === "map" ? styles.navTextActive : styles.navText}>
            Map
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* =====================================
                STYLES
   ===================================== */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f4f4f5", // warna netral seperti sebelumnya
  },

  header: {
    paddingTop: 12, // ⭐ HEADER TURUN — padding tambahan
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#2563EB",
  },

  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },

  headerSub: {
    color: "#dbeafe",
    fontSize: 12,
  },

  nav: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },

  navText: {
    fontSize: 12,
    color: "gray",
  },

  navTextActive: {
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "600",
  },
});
