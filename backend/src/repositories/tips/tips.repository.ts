import axios, { AxiosError } from "axios";
import dotenv from "dotenv";
import { handleAxiosError } from "../../utils/axiosErrorHandler";
import { Tip, TipsResponse, TipsType } from "../../models/tips.models";
import { ChampionName } from "../../models/league.models";
import Tips from "./tips.mongo";
import { Languages } from "../../models/users.models";
import { LLMOptions } from "../../models/llm.models";
dotenv.config();

class TipsRepository {
  private baseURL: string;

  constructor() {
    this.baseURL = `${process.env.ML_SERVER_URL}/tips`;
  }

  /**
   *  ML generation of tips
   */
  async generateTips(tipsType: TipsType, myChampion: ChampionName, otherChampion: ChampionName, model: LLMOptions, language: Languages): Promise<TipsResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/`, {
        tips_type: tipsType,
        my_champion: myChampion,
        other_champion: otherChampion,
        model: model,
        language: language
      });

      const tipsResponse = response.data?.response;
      if (tipsResponse) {
        return tipsResponse;
      } else {
        throw new Error("Invalid response from the tips API.");
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
      throw new Error("Failed generating tips.");
    }
  }

  async getTips(tipsType: TipsType, myChampion: ChampionName, otherChampion: ChampionName, model: LLMOptions, language: Languages): Promise<TipsResponse | null> {
    try {
      const res = await Tips.findOne({ tipsType, myChampion, otherChampion, language }).exec();
      return res || null;
    } catch (error) {
      throw new Error(`Error fetching session by ID: ${error}`);
    }
  }

  async saveTips(tipsType: TipsType, myChampion: ChampionName, otherChampion: ChampionName, tips: Tip[], model: LLMOptions, language: Languages): Promise<TipsResponse> {
    try {
      return await Tips.findOneAndUpdate(
        { tipsType, myChampion, otherChampion, language },
        { tips },
        { upsert: true, new: true }
      ).exec();
    } catch (error) {
      throw new Error(`Error saving tips: ${error}`);
    }
  }
}

export default new TipsRepository();
