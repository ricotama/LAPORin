// HomeScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Report } from "../types/ReportTypes";

interface Props {
  reports: Report[];
  onGoReport: () => void;
  onGoList: () => void;
}

const categories = ["jalan", "jembatan", "drainase", "lampu", "lainnya"];

const HomeScreen: React.FC<Props> = ({ reports, onGoReport, onGoList }) => {
  const total = reports.length;

  // Hitung statistik kategori
  const categoryCount: Record<string, number> = {
    jalan: 0,
    jembatan: 0,
    drainase: 0,
    lampu: 0,
    lainnya: 0,
  };

  reports.forEach((r) => {
    if (categoryCount[r.category] !== undefined) {
      categoryCount[r.category] += 1;
    }
  });

  // Mencari nilai maksimum untuk skala bar
  const maxValue = Math.max(...Object.values(categoryCount), 1);

  return (
    <View style={styles.container}>
      
      {/* Card Welcome */}
      <View style={styles.card}>
        <Text style={styles.title}>LAPORin</Text>
        <Text style={styles.subtitle}>Aplikasi Pelaporan Kerusakan Infrastruktur</Text>

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total Laporan</Text>
          <Text style={styles.totalValue}>{total}</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menuRow}>
        <TouchableOpacity onPress={onGoReport} style={styles.menuCard}>
          <Ionicons name="add-circle-outline" size={36} color="#2563EB" />
          <Text style={styles.menuText}>Buat Laporan</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onGoList} style={styles.menuCard}>
          <Ionicons name="list-outline" size={36} color="#16A34A" />
          <Text style={styles.menuText}>Daftar Laporan</Text>
        </TouchableOpacity>
      </View>

      {/* Statistik Section */}
      <View style={styles.statCard}>
        <Text style={styles.statTitle}>Statistik Kategori</Text>

        {categories.map((cat) => (
          <View key={cat} style={styles.statRow}>
            <Text style={styles.statLabel}>{cat.toUpperCase()}</Text>

            {/* Grafik Bar */}
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.barFill,
                  { width: `${(categoryCount[cat] / maxValue) * 100}%` },
                ]}
              />
            </View>

            <Text style={styles.statNumber}>{categoryCount[cat]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default HomeScreen;

/* ----------- STYLES ----------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  card: {
    backgroundColor: "white",
    padding: 16,
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },

  totalBox: {
    backgroundColor: "#DBEAFE",
    padding: 14,
    borderRadius: 10,
  },

  totalLabel: {
    fontSize: 13,
    color: "#1E3A8A",
  },

  totalValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E40AF",
  },

  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  menuCard: {
    width: "48%",
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
  },

  menuText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },

  /* Statistik */
  statCard: {
    backgroundColor: "white",
    marginTop: 30, // ⭐ Turunkan jarak ke bawah
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },

  statTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },

  statLabel: {
    width: 90,
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  barContainer: {
    flex: 1,
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginHorizontal: 10,
  },

  barFill: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 6,
  },

  statNumber: {
    width: 24,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "600",
  },
});
