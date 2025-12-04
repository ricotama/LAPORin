// screens/ReportFormScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { FormDataType, Report, Category } from "../types/ReportTypes";

interface Props {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  onSubmit: () => void;
  editing: Report | null;
  onCancelEdit: () => void;
}

const categories: Category[] = [
  "jalan",
  "jembatan",
  "drainase",
  "lampu",
  "lainnya",
];

const ReportFormScreen: React.FC<Props> = ({
  formData,
  setFormData,
  onSubmit,
  editing,
  onCancelEdit,
}) => {

  // PILIH FOTO & SIMPAN BASE64
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Izin ditolak", "Aktifkan izin galeri.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.6
    });

    if (!result.canceled) {
      const base64Img = "data:image/jpeg;base64," + result.assets[0].base64;

      setFormData((prev) => ({
        ...prev,
        photoUrl: base64Img,
      }));
    }
  };

  // AMBIL LOKASI GPS
  const getLocation = async () => {
    const perm = await Location.requestForegroundPermissionsAsync();
    if (perm.status !== "granted") {
      Alert.alert("Izin lokasi ditolak");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setFormData((prev) => ({
      ...prev,
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{editing ? "Edit Laporan" : "Buat Laporan"}</Text>

        {editing && (
          <TouchableOpacity onPress={onCancelEdit}>
            <Ionicons name="close-circle" size={28} color="red" />
          </TouchableOpacity>
        )}
      </View>

      {/* JUDUL */}
      <Text style={styles.label}>Judul</Text>
      <TextInput
        style={styles.input}
        placeholder="Contoh: Jalan berlubang"
        value={formData.title}
        onChangeText={(t) => setFormData({ ...formData, title: t })}
      />

      {/* KATEGORI */}
      <Text style={styles.label}>Kategori</Text>
      <View style={styles.categoryRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.catChip,
              formData.category === cat && styles.catChipActive,
            ]}
            onPress={() => setFormData({ ...formData, category: cat })}
          >
            <Text
              style={[
                styles.catText,
                formData.category === cat && styles.catTextActive,
              ]}
            >
              {cat.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* DESKRIPSI */}
      <Text style={styles.label}>Deskripsi</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={formData.description}
        onChangeText={(t) => setFormData({ ...formData, description: t })}
        multiline
        placeholder="Jelaskan kondisi kerusakan..."
      />

      {/* ALAMAT */}
      <Text style={styles.label}>Alamat</Text>
      <TextInput
        style={styles.input}
        placeholder="Alamat kejadian"
        value={formData.address}
        onChangeText={(t) => setFormData({ ...formData, address: t })}
      />

      {/* FOTO */}
      <Text style={styles.label}>Foto Kerusakan</Text>
      <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
        <Ionicons name="image-outline" size={20} color="#2563EB" />
        <Text style={styles.photoBtnText}>Pilih Foto</Text>
      </TouchableOpacity>

      {formData.photoUrl ? (
        <Image source={{ uri: formData.photoUrl }} style={styles.preview} />
      ) : (
        <Text style={styles.noImage}>Belum ada foto</Text>
      )}

      {/* GPS */}
      <View style={styles.locHeader}>
        <Text style={styles.label}>Lokasi GPS</Text>
        <TouchableOpacity style={styles.locBtn} onPress={getLocation}>
          <Ionicons name="locate-outline" size={16} color="#2563EB" />
          <Text style={styles.locBtnText}>Ambil Lokasi</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.latLongRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.smallLabel}>Latitude</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(formData.latitude)}
            onChangeText={(t) => setFormData({ ...formData, latitude: Number(t) })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.smallLabel}>Longitude</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(formData.longitude)}
            onChangeText={(t) => setFormData({ ...formData, longitude: Number(t) })}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
        <Ionicons name="send-outline" size={18} color="white" />
        <Text style={styles.submitText}>
          {editing ? "Update Laporan" : "Kirim Laporan"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ReportFormScreen;

/* ====================== STYLES ========================= */

const styles = StyleSheet.create({
  container: { padding: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: "700" },
  label: { marginTop: 12, fontSize: 14, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  categoryRow: { flexDirection: "row", flexWrap: "wrap" },
  catChip: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 6,
    marginTop: 6,
  },
  catChipActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  catText: { fontSize: 12 },
  catTextActive: { color: "white", fontWeight: "700" },
  photoBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    padding: 10,
    borderRadius: 8,
    width: 140,
    marginTop: 4,
  },
  photoBtnText: { marginLeft: 6, color: "#2563EB" },
  preview: { width: "100%", height: 160, borderRadius: 10, marginTop: 8 },
  noImage: { fontSize: 12, color: "gray", marginTop: 4 },
  locHeader: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  locBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    padding: 6,
    borderRadius: 6,
  },
  locBtnText: { marginLeft: 4, color: "#2563EB" },
  latLongRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  inputGroup: { flex: 1, marginRight: 8 },
  submitBtn: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  submitText: { color: "white", fontWeight: "700", marginLeft: 6 },
  smallLabel: { fontSize: 12, color: "#555", marginBottom: 2 },
});
