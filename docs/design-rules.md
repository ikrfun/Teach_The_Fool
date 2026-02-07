# Teach the Fool — Tone & Manner / Design Rules

## トンマナ
- 明るくやさしい学習体験。安心感・親しみ・清潔感。
- 色は柔らかいペールトーン＋アクセント少なめ。可愛いが子供っぽすぎない。
- 情報密度は控えめ、空白を十分に取り、呼吸感のあるレイアウト。

## カラーパレット
- Brand: ペリウィンクル系ブルー（brand-500 #6B80FF）
- Accent: コーラル系オレンジ（accent-500 #FF8A5B）
- Background: クリームベージュ（#FFF7EB）
- Surface: ホワイト（#FFFFFF）
- Text: スレート（#445166）
- Muted: グレー（#7D8EA2）

## 形状と余白
- 角丸はカード・モーダルで 16–24px、ボタンはフルピル。
- 影は控えめ（soft/elevated）。ドロップ影は青みの少ないニュートラル。
- コンポーネント間の縦間隔は 16–24px を基本、セクションは 32–48px。

## タイポグラフィ
- 見出しは 24–28px（太め）、本文は 16–18px（中庸）。
- 行間を広めに（本文 1.6–1.8）。文字色は Text、補助説明は Muted。
- アイコンはラウンドラインの親和性高いものを使用。

## コンポーネント原則
- Header: brand 背景、テキスト白、CTAは白地＋brand テキストまたは brand ピル。
- Card: surface 背景＋soft shadow。本文は Text、補助は Muted。
- Button: ピル形状、brand 基調。Danger/警告は accent を使用。
- Input: surface 背景、Muted ボーダー、角丸 12–16px。
- Chips/Badges: brand/Mutedの淡色、文字は Text。
- Chat Bubbles: 役割別に淡色背景（teacher=brand-50、fool=accent-50、user=surface）。

## アクセシビリティとコントラスト
- 背景色と文字色の「同系色・同明度」の重ね合わせは禁止（読みづらさ回避）。
- テキストは WCAG AA 以上のコントラスト（推奨 4.5:1）を確保。
- CTAは「bg-brand ＋ text-white」または「bg-white ＋ text-brand（背景はbrand以外）」のいずれかに統一。
- Inputは「bg-surface ＋ text-text ＋ placeholder:text-muted」。フォーカスは ring-brand。

## モーション
- フェード/スライドは 120–180ms。イージングは ease-out。
- ホバーは影と彩度を控えめに増す。クリック時は小さく沈む。

## ダークモード（将来）
- まずライトを標準。ダークでは brand を少し彩度アップ、背景はネイビー系ダーク。

## 実装方針
- Tailwind @theme inline で色トークンを定義（brand/accent/bg/surface/text/muted）。
- クラスは bg-brand-500、bg-surface、text-text、border-muted、shadow-soft を基本に統一。
