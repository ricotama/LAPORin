// components/ReportCard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Report } from "../types/ReportTypes";

interface Props {
  report: Report;
  onEdit: () => void;
  onDelete: () => void;
}

const ReportCard: React.FC<Props> = ({ report, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      {report.photoUrl && (
        <Image source={{ uri: report.photoUrl }} style={styles.photo} />
      )}

      <View style={styles.body}>
        <Text style={styles.title}>{report.title}</Text>
        <Text style={styles.desc}>{report.description}</Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color="gray" />
          <Text style={styles.address}>{report.address}</Text>
        </View>

        <Text style={styles.coord}>
          Lat: {report.latitude.toFixed(5)} | Lng: {report.longitude.toFixed(5)}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.time}>
            {new Date(report.timestamp).toLocaleString("id-ID")}
          </Text>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
              <Ionicons name="create-outline" size={16} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
              <Ionicons name="trash-outline" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ReportCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: 160,
  },
  body: {
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
  },
  desc: {
    color: "gray",
    marginTop: 6,
  },
  locationRow: {
    flexDirection: "row",
    marginTop: 6,
    alignItems: "center",
  },
  address: {
    marginLeft: 4,
    color: "gray",
    fontSize: 12,
  },
  coord: {
    backgroundColor: "#eee",
    marginTop: 6,
    padding: 6,
    textAlign: "center",
    borderRadius: 6,
    fontSize: 12,
  },
  footer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: {
    fontSize: 11,
    color: "gray",
  },
  btnRow: {
    flexDirection: "row",
    gap: 8,
  },
  editBtn: {
    backgroundColor: "#f59e0b",
    padding: 8,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: "#dc2626",
    padding: 8,
    borderRadius: 6,
  },
});
