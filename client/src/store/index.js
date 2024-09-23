import { create } from "zustand";
import {createAuthSlice} from "@/store/slices/auth-slice.js";


export const useAppstore = create()((...a) => ({
    ...createAuthSlice(...a),
}));