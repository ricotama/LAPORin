import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ReportCard from "../components/ReportCard";
import { Report } from "../types/ReportTypes";

interface Props {
  reports: Report[];
  onEdit: (report: Report) => void;
  onDelete: (id: string) => void;
}

const ReportListScreen: React.FC<Props> = ({ reports, onEdit, onDelete }) => {
  if (reports.length === 0) {
    return (
      <View style={styles.empty}>
        <Text>Belum ada laporan</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={reports}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <ReportCard report={item} onEdit={() => onEdit(item)} onDelete={() => onDelete(item.id)} />
      )}
    />
  );
};

export default ReportListScreen;

const styles = StyleSheet.create({
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
});
