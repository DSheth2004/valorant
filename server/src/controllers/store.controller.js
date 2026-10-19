import { User } from "../models/User.js";
import { getItem, getStoreRotation, isInRotation } from "../services/catalog.js";
import { HttpError } from "../utils/HttpError.js";

export function getStorefront(_req, res) {
  res.set("Cache-Control", "no-store");
  res.json(getStoreRotation());
}

export async function purchaseItem(req, res) {
  const { itemId } = req.body;
  const item = getItem(itemId);

  if (!item) throw new HttpError(404, "That item does not exist", { code: "ITEM_NOT_FOUND" });
  if (!isInRotation(itemId)) {
    throw new HttpError(410, "This offer has expired. Check today's store", { code: "OFFER_EXPIRED" });
  }

  // Price comes from the server catalog, never from the client. The balance check,
  // ownership check and deduction happen in one atomic update, so two simultaneous
  // purchases can't overspend or buy the same item twice.
  const updated = await User.findOneAndUpdate(
    {
      _id: req.user._id,
      valorantPoints: { $gte: item.price },
      "inventory.itemId": { $ne: item.id },
    },
    {
      $inc: { valorantPoints: -item.price },
      $push: { inventory: { itemId: item.id, pricePaid: item.price, purchasedAt: new Date() } },
    },
    { returnDocument: "after" },
  );

  if (!updated) {
    const current = await User.findById(req.user._id).lean();
    if (current?.inventory.some((owned) => owned.itemId === item.id)) {
      throw new HttpError(409, "You already own this item", { code: "ALREADY_OWNED" });
    }
    throw new HttpError(400, `You need ${item.price - (current?.valorantPoints ?? 0)} more VP`, {
      code: "INSUFFICIENT_FUNDS",
    });
  }

  res.status(201).json({ item, user: updated });
}
