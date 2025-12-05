import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { FormDataType } from "../types/ReportTypes";

interface Props {
  formData: FormDataType;
  setFormData: (data: FormDataType) => void;
  onSubmit: () => void;
  editing: any;
  onCancelEdit: () => void;
}

export default function ReportFormScreen({
  formData,
  setFormData,
  onSubmit,
  editing,
  onCancelEdit,
}: Props) {
  
  /* PICK IMAGE BASE64 */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setFormData({
        ...formData,
        photoUrl: "data:image/jpeg;base64," + result.assets[0].base64,
      });
    }
  };

  /* GET GPS */
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Izin lokasi ditolak.");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setFormData({
      ...formData,
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Judul */}
      <Text style={styles.label}>Judul</Text>
      <TextInput
        style={styles.input}
        placeholder="Contoh: Jalan berlubang"
        value={formData.title}
        onChangeText={(v) => setFormData({ ...formData, title: v })}
      />

      {/* Kategori */}
      <Text style={styles.label}>Kategori</Text>
      <View style={styles.categoryRow}>
        {["jalan", "jembatan", "drainase", "lampu", "lainnya"].map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setFormData({ ...formData, category: cat })}
            style={[
              styles.categoryButton,
              formData.category === cat && styles.categoryButtonActive,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                formData.category === cat && styles.categoryTextActive,
              ]}
            >
              {cat.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Deskripsi */}
      <Text style={styles.label}>Deskripsi</Text>
      <TextInput
        style={styles.textArea}
        multiline
        placeholder="Jelaskan kondisi kerusakan..."
        value={formData.description}
        onChangeText={(v) => setFormData({ ...formData, description: v })}
      />

      {/* Alamat */}
      <Text style={styles.label}>Alamat</Text>
      <TextInput
        style={styles.input}
        placeholder="Alamat kejadian"
        value={formData.address}
        onChangeText={(v) => setFormData({ ...formData, address: v })}
      />

      {/* Foto */}
      <Text style={styles.label}>Foto Kerusakan</Text>

      <TouchableOpacity style={styles.photoBox} onPress={pickImage}>
        <Ionicons name="image-outline" size={34} color="#2563EB" />
        <Text style={styles.photoText}>Pilih Foto</Text>
      </TouchableOpacity>

      {formData.photoUrl ? (
        <Image source={{ uri: formData.photoUrl }} style={styles.previewImage} />
      ) : (
        <Text style={styles.noPhoto}>Belum ada foto</Text>
      )}

      {/* GPS */}
      <View style={styles.locationHeader}>
        <Text style={styles.label}>Lokasi GPS</Text>

        <TouchableOpacity onPress={getLocation} style={styles.locationButton}>
          <Ionicons name="locate-outline" size={20} color="#2563EB" />
          <Text style={styles.locText}>Ambil Lokasi</Text>
        </TouchableOpacity>
      </View>

      {/* Peta kecil */}
      <MapView
        style={styles.mapSmall}
        region={{
          latitude: formData.latitude,
          longitude: formData.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker
          coordinate={{
            latitude: formData.latitude,
            longitude: formData.longitude,
          }}
        />
      </MapView>

      {/* Koordinat */}
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.labelSmall}>Latitude</Text>
          <TextInput
            style={styles.input}
            value={String(formData.latitude)}
            onChangeText={(v) =>
              setFormData({ ...formData, latitude: parseFloat(v) })
            }
          />
        </View>

        <View style={{ width: 16 }} />

        <View style={{ flex: 1 }}>
          <Text style={styles.labelSmall}>Longitude</Text>
          <TextInput
            style={styles.input}
            value={String(formData.longitude)}
            onChangeText={(v) =>
              setFormData({ ...formData, longitude: parseFloat(v) })
            }
          />
        </View>
      </View>

      {/* Submit */}
      <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
        <Ionicons name="send-outline" size={20} color="white" />
        <Text style={styles.submitText}>
          {editing ? "Update Laporan" : "Kirim Laporan"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ====================== STYLES ====================== */
const styles = StyleSheet.create({
  container: { padding: 16 },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 10,
    fontSize: 14,
  },

  textArea: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    height: 110,
    borderRadius: 10,
    textAlignVertical: "top",
    fontSize: 14,
  },

  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },

  categoryButtonActive: {
    backgroundColor: "#2563EB",
  },

  categoryText: {
    fontSize: 13,
    color: "#374151",
  },

  categoryTextActive: {
    color: "white",
    fontWeight: "700",
  },

  photoBox: {
    backgroundColor: "#DBEAFE",
    padding: 18,
    height: 75,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  photoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2563EB",
  },

  previewImage: {
    marginTop: 10,
    height: 180,
    borderRadius: 12,
    width: "100%",
  },

  noPhoto: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 12,
  },

  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },

  locationButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  locText: {
    color: "#2563EB",
    marginLeft: 4,
    fontWeight: "600",
  },

  mapSmall: {
    height: 150,
    borderRadius: 12,
    marginTop: 10,
    width: "100%",
  },

  labelSmall: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },

  row: {
    flexDirection: "row",
  },

  submitButton: {
    backgroundColor: "#2563EB",
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
