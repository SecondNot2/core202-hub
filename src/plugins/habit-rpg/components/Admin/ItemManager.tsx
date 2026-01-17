import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Upload,
  Search,
  Package,
} from "lucide-react";
import { supabase } from "@core/supabase/client";
import { Modal, useToast, useConfirm } from "@shared/components";
import { RARITY_CONFIG } from "../../domain/items";
import type { Rarity } from "../../domain/types";

// Types
interface RPGItem {
  id: string;
  name: string;
  type: "consumable" | "equipment";
  rarity: Rarity;
  description: string;
  icon_url: string;
  sell_price: number;
  max_stack?: number;
  slot?: string;
  stats?: any;
  affinity?: string;
  affinity_bonus?: number;
  max_durability?: number;
  decay_rate?: number;
}

const ItemManager: React.FC = () => {
  const [items, setItems] = useState<RPGItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<RPGItem>>({});
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { toast } = useToast();
  const { confirm } = useConfirm();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("rpg_items")
      .select("*")
      .order("name");

    if (error) {
      toast.error("Failed to load items: " + error.message);
    } else {
      setItems(data || []);
    }
    setIsLoading(false);
  };

  const handleEdit = (item: RPGItem) => {
    setEditingItem(item);
    setIconFile(null);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingItem({
      type: "consumable",
      rarity: "common",
      sell_price: 10,
      stats: {},
    });
    setIconFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = await confirm({
      title: "Delete Item",
      message: `Are you sure you want to delete "${name}"? This cannot be undone.`,
      variant: "danger",
    });

    if (confirmed) {
      const { error } = await supabase.from("rpg_items").delete().eq("id", id);
      if (error) {
        toast.error("Failed to delete: " + error.message);
      } else {
        toast.success("Item deleted");
        fetchItems();
      }
    }
  };

  const handleFileUpload = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `items/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("rpg-assets")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("rpg-assets").getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let iconUrl = editingItem.icon_url;

      if (iconFile) {
        iconUrl = (await handleFileUpload(iconFile)) || "";
      }

      // Generate ID if new
      const itemId = editingItem.id || `item_${Date.now()}`;

      // Prepare payload
      const payload = {
        ...editingItem,
        id: itemId,
        icon_url: iconUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("rpg_items").upsert(payload);

      if (error) throw error;

      toast.success(editingItem.id ? "Item updated" : "Item created");
      setIsModalOpen(false);
      fetchItems();
    } catch (err: any) {
      toast.error("Error saving item: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const filteredItems = items.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Item Manager</h1>
          <p className="text-slate-500">
            Manage RPG items, equipment, and assets
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} /> Add Item
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="relative">
          <Search
            className="absolute left-3 top-2.5 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent dark:text-white focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-500">
                Asset
              </th>
              <th className="p-4 text-sm font-semibold text-slate-500">
                Name / ID
              </th>
              <th className="p-4 text-sm font-semibold text-slate-500">Type</th>
              <th className="p-4 text-sm font-semibold text-slate-500">
                Rarity
              </th>
              <th className="p-4 text-sm font-semibold text-slate-500">
                Price
              </th>
              <th className="p-4 text-sm font-semibold text-slate-500 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Loading items...
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No items found.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                      {item.icon_url ? (
                        <img
                          src={item.icon_url}
                          alt={item.name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <Package size={20} className="text-slate-400" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium dark:text-white">
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {item.id}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.type === "equipment"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className="capitalize font-medium"
                      style={{ color: RARITY_CONFIG[item.rarity]?.color }}
                    >
                      {item.rarity}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">
                    {item.sell_price} Gold
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem.id ? "Edit Item" : "Create Item"}
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                ID
              </label>
              <input
                type="text"
                value={editingItem.id || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, id: e.target.value })
                }
                disabled={!!editingItem.id} // Disable editing ID for existing
                placeholder="e.g. eq_sword_common"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={editingItem.name || ""}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, name: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Type
              </label>
              <select
                value={editingItem.type}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    type: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent dark:text-white"
              >
                <option value="consumable">Consumable</option>
                <option value="equipment">Equipment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Rarity
              </label>
              <select
                value={editingItem.rarity}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    rarity: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent dark:text-white"
              >
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              value={editingItem.description || ""}
              onChange={(e) =>
                setEditingItem({ ...editingItem, description: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent dark:text-white h-24"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Sell Price
              </label>
              <input
                type="number"
                value={editingItem.sell_price || 0}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    sell_price: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent dark:text-white"
              />
            </div>
            {editingItem.type === "equipment" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Slot
                </label>
                <select
                  value={editingItem.slot || "tool"}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, slot: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent dark:text-white"
                >
                  <option value="tool">Tool</option>
                  <option value="environment">Environment</option>
                  <option value="accessory">Accessory</option>
                </select>
              </div>
            )}
          </div>

          {/* Icon Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Icon
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-700 border border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                {iconFile ? (
                  <img
                    src={URL.createObjectURL(iconFile)}
                    className="w-full h-full object-contain"
                  />
                ) : editingItem.icon_url ? (
                  <img
                    src={editingItem.icon_url}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Package className="text-slate-400" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] && setIconFile(e.target.files[0])
                  }
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Recommended: 64x64 PNG
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              {isUploading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              Save Item
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ItemManager;
