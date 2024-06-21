import axios from 'axios';
import { workspace } from 'vscode';
import { ITranslate, ITranslateOptions } from 'comment-translate-manager';

const PREFIXCONFIG = 'deeplxTranslate';
const PREFIXCONFIGa = 'commentTranslate';







export function getConfig<T>(key): T | undefined {
    const configuration = workspace.getConfiguration(PREFIXCONFIG);
    return configuration.get<T>(key);
}

export function getConfigaa<T>(key): T | undefined {
    const configuration = workspace.getConfiguration(PREFIXCONFIGa);
    return configuration.get<T>(key);
}





interface DeepLXTranslateOption {

    apiUrl?: string;
}

export class DeepLXTranslate implements ITranslate {

    get maxLen(): number {
        const a = getConfigaa<number>('maxTranslationLength') || 6000;
        return a;
    }

    private _defaultOption: DeepLXTranslateOption;
    private readonly _translateApiUrl: string;

    constructor() {

        const apiUrl = getConfig<string>('authKey') || 'http://127.0.0.1:1188/translate';
        this._translateApiUrl = apiUrl;

        this._defaultOption = this.createOption();
        workspace.onDidChangeConfiguration(async eventNames => {
            if (eventNames.affectsConfiguration(PREFIXCONFIG)) {
                this._defaultOption = this.createOption();
            }
        });
    }

    createOption() {
        const defaultOption: DeepLXTranslateOption = {
        };
        return defaultOption;
    }

    async translate(content: string): Promise<string> {
        const contents = getConfig<string>('contents') || 'Flutter& Dart';
        const source = getConfig<string>('source') || 'EN';
        const target = getConfig<string>('target') || 'ZH';
        const split = getConfig('split') || null;
        const formality = getConfig<string>('formality') || 'prefer_less';

        const requestPayload = {
            text: content,
            content: contents,
            source_lang: source,
            target_lang: target,
            formality: 'prefer_less',
            split_sentences: split
        };

        const encodedData = JSON.stringify(requestPayload);

        try {
            const response = await axios.post(this._translateApiUrl, encodedData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                const { data } = response.data;
                return data;
            } else {
                throw new Error(`翻译失败 ${response.status}`);
            }
        } catch (error) {
            throw new Error(`翻译失败: ${error.message}`);
        }
    }

    link(content: string, { to = 'auto' }: ITranslateOptions) {

        return '';
    }

    isSupported(src: string) {

        return true;
    }
}






