// screens/HomeScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Report } from "../types/ReportTypes";

interface Props {
  reports: Report[];
  onGoReport: () => void;
  onGoList: () => void;
}

const HomeScreen: React.FC<Props> = ({ reports, onGoReport, onGoList }) => {
  const categories = ["jalan", "jembatan", "drainase", "lampu", "lainnya"];

  const count = (cat: string) =>
    reports.filter((r) => r.category === cat).length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>LAPORin</Text>
        <Text style={styles.sub}>Aplikasi Pelaporan Kerusakan Infrastruktur</Text>

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total Laporan</Text>
          <Text style={styles.totalNumber}>{reports.length}</Text>
        </View>
      </View>

      <View style={styles.menuRow}>
        <TouchableOpacity style={styles.menuBtn} onPress={onGoReport}>
          <Ionicons name="add-circle-outline" size={32} color="#2563eb" />
          <Text>Buat Laporan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuBtn} onPress={onGoList}>
          <Ionicons name="list-outline" size={32} color="#16a34a" />
          <Text>Daftar Laporan</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.box}>
        <Text style={styles.title2}>Statistik Kategori</Text>

        {categories.map((c) => (
          <View key={c} style={styles.statRow}>
            <Text>{c.toUpperCase()}</Text>
            <Text>{count(c)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 30 },
  box: { backgroundColor: "white", padding: 16, borderRadius: 12, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: "700" },
  sub: { fontSize: 12, color: "gray" },
  totalBox: {
    backgroundColor: "#e0edff",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  totalLabel: { fontSize: 12, color: "#2563eb" },
  totalNumber: { fontSize: 20, fontWeight: "700", color: "#2563eb" },
  menuRow: { flexDirection: "row", justifyContent: "space-between" },
  menuBtn: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "48%",
    alignItems: "center",
    elevation: 2,
  },
  title2: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  statRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
});
