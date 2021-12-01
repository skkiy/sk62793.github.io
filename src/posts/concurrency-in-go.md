---
title: "Concurrency in Go"
date: "2021-12-01"
---


# GO言語による並行処理

# 1章 並行処理入門

並行処理とは：一つ以上の処理が同時に発生する処理

クラウドコンピューティングによってコードを並行にするかという問題が生まれた
→Webスケール：驚異的並列化可能な問題
→ローリングアップデート、水平スケールが可能に

## 並行処理の難しさ

### 競合状態

データ競合：同じ変数に読み込みと書き込みが同時に起こる

### アトミック性

アトミック性：それが操作されている特定のコンテキスト（スコープ、操作がアトミックであると考えられる範囲）の中では分割不能、或いは中断不可であること

分割不能、中断不可：コンテキストの中で、何かアトミックな処理が起きた場合には、そのコンテキスト全体で処理をしていて、その他の何かが同時には起きていない

### メモリアクセス同期

クリティカルセクション：プログラム内で共有リソースに対する排他的なアクセスが必要な場所

メモリへの同期的アクセスによって解決できるわけではない

### デッドロック

全ての並行なプロセスがお互いの処理を待ち合っている状況

検知するためのissue(https://github.com/golang/go/issues/13759)

Coffman条件
相互排他：ある並行プロセスがリソースに対して排他的な権利をどの時点においても保持している。
条件待ち：ある並行プロセスはリソースの保持と追加のリソース待ちを同時に行わなければならない。
横取り不可：ある並行プロセスによって保持されているリソースは、ソロプロセスによって飲み解放される。
循環待ち：ある並行プロセス（P1）は、他の連なっている並行プロセス（P2）を待たなければならない。そしてP2はP1を待っている。

### ライブロック

並行操作を行なっているけど、その操作はプログラムの状態を全く進めていないプログラム
廊下で人同士（複数のgoroutine）がお互いに道を譲ろうとして（デッドロックを予防して）いる状態

### リソース枯渇

並行プロセスが仕事をするのに必要なリソースを取得できない状況
あるゴルーチンが不必要にクリティカルセクションを超えて共有ロックを広げ、他のゴルーチンが効率的に仕事をできない状態
検知するにはログを出力して、仕事の速度が期待通りになっているかを測定する

### 安全性

並行処理が関わる問題空間で関数、メソッド、変数を公開する場合は、以下の3点に触れる。
・誰が並行処理を担っているか。
・問題空間がどのように並行処理のプリミティブに対応しているか。
・誰が同期処理を担っているか。

# 2章 並行性をどうモデル化するか：CSPとは何か

## 並行性と並列性の違い

並行性はコードの性質を指し、並列性は動作しているプログラムの性質を指す。

## CSP(Communicating Sequential Processes)

独立したプロセス群がメッセージパッシングによって通信することで相互にやりとりしているもの
GoではCSPを言語仕様として採用しているため、読み書き、理解のコストが低くなっている

通信によってメモリを共有し、メモリの共有によって通信してはいけない

プリミティブを使うか、チャネルを使うかの判断基準
・データの所有権を移動しようとしているか
・構造体の内部の状態を保護しようとしているか
・複数のロジックを強調させようとしているか
・パフォーマンスクリティカルセクションか

# 3章 Goにおける並行処理の構成要素

### ゴルーチン

一時停止や再エントリーのポイントは提供されておらず、ランタイムによって自動的に行われる
ゴルーチンがブロックしたときにのみ割り込まれる

OSスレッド、グリーンスレッド
M:Nスケジューラー（M個のグリーンスレッドをN個のOSスレッドに対応させるもの）

fork-joinモデル：プログラムが子の処理を分岐させて、親と並行に実行させること。この処理が親に再度合流する場所を合流ポイントと呼ぶ。

合流ポイントの作成のためにsync.WaitGroupを使うことができる。

ゴルーチンは軽量

コンテキストスイッチ
別の並行プロセスに切り替えるために状態を保存する必要がある

### syncパッケージ

処理の完了を待つ

### MutexとRWMutex

相互排他、メモリに対する同期アクセスの慣習を作る

### Cond

ゴルーチンが待機したりイベントの発生を知らせるためのランデブーポイント

条件が起きるのを待っている間ロックをずっと保持しているわけではない

Signalはシグナルを一番長く待っているゴルーチンにシグナルを伝える
Broadcastはシグナルを待っている全てのゴルーチンにシグナルを伝える

### Once

Doに渡された関数が異なるゴルーチンで呼ばれたとしても一度しか実行されないようにする

### Pool

コストが高いものを作るときに数を制限して、決まった数しか作られないようにしつつ、予測できない数の操作がこれらにアクセスをリクエストできるようにする。複数のゴルーチンから安全に使うことができる。

### Channel

読み取り用チャネルから2つ目の戻り値を受け取ることができ、読み込みできたかどうか、閉じたチャネルから生成されたデフォルト値のいずれかを示す。

チャネルを閉じるにはcloseを使う

rangeを使うと、チャネルが閉じたときに自動的にループを終了する

バッファ付きチャネル
読み込みが行われなくても書き込み可能な回数を増やす

チャネルを所有するゴルーチンが踏むべき手順
・チャネルを初期化する
・書き込みを行うか、他のゴルーチンに所有権を渡す
・チャネルを閉じる
・上の3つの手順をカプセルかして読み込みチャネルを経由して公開する

チャネルの消費者
・チャネルがいつ閉じられたかを把握する
・ブロックする操作は責任をもって扱う

```go
chanOwner := func() <- chan int {
	resultStream := make(chan int, 5)
	go func() {
		defer close(resultStream)
		for i := 0; i <= 5; i++ {
			resultStream <- i
		}
	}()
	return resultStream
}

resultStream := chanOwner()
for result := range resultStream {
	fmt.Printf("Received: %d\n", result)
}
fmt.Println("Done receiving!")
```

### select

キャンセル処理、タイムアウト、待機、デフォルト値といった概念とチャネルを安全にまとめる

複数のチャネルが同時に読み込めるようになったときは、疑似乱数による一様選択をする

タイムアウトにはtime.After関数を使える

### GOMAXPROCSレバー

ワークキューと呼ばれるOSスレッドの数を制御している

# 4章 Goでの並行処理パターン

## 拘束

情報をたった一つの平行プロセスからのみ得られることを確実にする考え方

アドホック拘束
拘束を規約によって達成した場合（静的解析）

レキシカル拘束
レキシカルスコープを使って適切なデータと並行処理のプリミティブだけを複数の平行プロセスが使えるように公開すること（コンパイラ）

## for-selectループ

・チャネルからくりかえしの変数を送出する

```go
for _, s := range []string{"a", "b", "c"} {
	select {
	case <- done:
		return
	case stringStream <- s:
	}
}
```

・停止シグナルを待つ無限ループ

```go
for {
	select {
	case <- done:
		return
	default:
	}
}
```

## ゴルーチンリークを避ける

ゴルーチンが終了する場合
・ゴルーチンが処理を完了する場合
・回復できないエラーにより処理を続けられない場合
・停止するように命令された場合

ゴルーチンの親子間で親から子にキャンセルのシグナルを送れるようにする

```go
doWork := func(
	done <- chan interface{},
	strings <- chan string,
) <- chan interface {} {
	terminated := make(chan interface{})
	go func() {
		defer fmt.Println("doWork exited.")
		defer close(terminated)
		for {
			select {
			case s := strings:
				fmt.Printlne(s)
			case <- done:
				return
			}
		}
	}()
	return terminated
}

done := make(chan interface{})
terminated := doWork(done, nil)

go func() {
	time.Sleep(1 * time.Second)
	fmt.Println("Canceling doWork goroutine...")
	close(done)
}()

<-terminated
fmt.Println("Done.")
```

```go
newRandStream := func(done <- chan interface{}) <- chan int {
	randStream := make(chan int)
	go func() {
		defer fmt.Println("newRandStream closure exited.")
		defer close(randStream)
		for {
			select {
			case randStream <- rand.Int():
			case <- done:
				return
			}
		}
	}()
	return randStream
}

done := make(chan interface{})
randStream := newRandStream(done)
fmt.Println("3 random ints:")
for i := 1; i <= 3; i++ {
	fmt.Printf("%d: %d\n", i, <- randStream)
}
close(done)
```

## orチャネル

```go
var or func(channels ...<-chan interface{}) <-chan interface{}
or = func(channels ...<-chan interface{}) <-chan interface{} {
	switch len(channels) {
	case 0:
		return nil
	case 1:
		return channels[0]
	}

	orDone := make(chan interface{})
	go func() {
		defer close(orDone)
		switch len(channels) {
		case 2:
			select {
			case <-channels[0]:
			case <-channels[1]:
			}
		default:
			select {
			case <-channels[0]:
			case <-channels[1]:
			case <-channels[2]:
			case <-or(append(channels[3:], orDone)...):
			}
		}
	}()
	return orDone
}

sig := func(after time.Duration) <-chan interface{} {
	c := make(chan interface{})
	go func() {
		defer close(c)
		time.Sleep(after)
	}()
	return c
}

start := time.Now()
<-or(
	sig(2*time.Hour),
	sig(5*time.Minute),
	sig(1*time.Second),
	sig(1*time.Hour),
	sig(1*time.Minute),
)
fmt.Printf("done after %v", time.Since(start))
```

## エラーハンドリング

https://www.ymotongpoo.com/works/goblog-ja/post/erros-are-values/

誰がそのエラーを処理する責任を持つべきか

並行プロセスはエラーを、プログラムの状態を完全に把握していて何をすべきかをより多くの情報に基づいて決定的できる別の箇所へと送るべき

```go
type Result struct {
	Error error
	Response *http.Response
}

checkStatus := func(done <-chan interface{}, urls ...string) <-chan Result {
	results := make(chan Result)
	go func() {
		defer close(results)

		for _, url := range urls {
			var result Result
			resp, err := http.Get(url)
			result = Result{Error: err, Response: resp}
			select {
			case <-done:
				return
			case results <-result:
			}
		}
	}()
	return results
}

done := make(chan interface{})
defer close(done)

urls := []string{"https://www.google.com", "https://badhost"}
for result := range checkStatus(done, urls...) {
	if result.Error != nil {
		fmt.Printf("error: %v", result.Error)
		continue
	}
	fmt.Printf("Response: %v\n", result.Response.Status)
}
```

## パイプライン

データを受け取って、何らかの処理を行なって、どこかに渡すという一連の作業

ステージの性質
・受け取るものと返すものが同じ型
・弾き回せるように具体化されている

バッチ処理とストリーム処理

### パイプライン構築のためのベストプラクティス

```go
geenrator := func(done <-chan interface{}, integers ...int) <-chan int {
	intStream := make(chan int, len(integers))
	go func() {
		defer close(intStream)
		for _, i := range integers {
			select {
			case <-done:
				return
			case intStream <- i:
			}
		}
	}()
	return intStream
}

multiply := func(
	done <-chan interface{},
	intStream <-chan int,
	multipier int,
) <-chan int {
	multipliedStream := make(chan int)
	go func() {
		defer close(multipliedStream)
		for i := range intStream {
			select {
			case <-done:
				return
			case multipliedStream <- i*multiplier:
			}
		}
	}()
return multipliedStream
}

add := func(
	done <-chan interface{},
	intStream <-chan int,
	additive int,
) <-chan int {
	addedStream := make(chan int)
	go func() {
		defer close(addedStream)
		for i := range(intStream) {
			select {
			case <-done:
				return
			case addedStream <- i+additive:
			}
		}
	}()
	return addedStream
}

done := make(chan interface{})
defer close(done)

intStream := generator(done, 1, 2, 3, 4)
pipeline := multiply(done, add(done, multiply(done, intStream, 2), 1), 2)

for v := range pipeline {
	fmt.Printlne(v)
}
```

```go
repeat := func(
	done <-chan interface{},
	values ...interface{},
) <-chan interface{} {
	valueStream := make(chan interface{})
	go func() {
		defer close(valueStream)
		for {
			for _, v := range values {
				select {
				case <- done:
					return
				case valueStream <- v:
				}
			}
		}
	}()
	return valueStream
}

take := func(
	done <-chan interface{},
	valueStream <-chan interface{},
	num int,
) <- chan interface{} {
	takeStream := make(chan interface{})
	go func() {
		defer close(takeStream)
		
		for i := 0; i < num; i++ {
			select {
			case <-done:
				return
			case takeStream <- <- valueStream:
			}
		}
	}()
	return takeStream
}

done := make(chan interface{})
defer close(done)

for num := range take(done, repeat(done, 1), 10) {
	fmt.Printf("%v ", num)
}

repeatFn := func(
	done <-chan interface{},
	fn func() interface{},
) <-chan interface{} {
	valueStream := make(chan interface{})
	go func() {
		defer close(valueStream)
		for {
			select {
			case <-done:
				return
			case valueStream <- fn():
			}
		}
	}()
	return valueStream
}

done := make(chan interface{})
defer close(done)

rand := func() interface{} { return rand.Int() }

for num := range take(done, repeatFn(done, rand), 10) {
	fmt.Println(num)
}

toString := func(
	done <-chan interfacce{},
	valueStream <-chan interface{},
) <-chan string {
	stringStream := make(chan string)
	go func() {
		defer close(stringStream)
		for v := range valueStream {
			select {
			case <-done:
				return
			case stringStream <- v.(string):
			}
		}
	}()
	return stringStream
}

done := make(chan interface{})
defer close(done)

var message string
for token := range toString(done, take(done, repeat(done, "I", "am."), 5)) {
	message += token
}

fmt.Printf("message: %s...", message)
```

## ファンアウト、ファンイン

ファンアウト：パイプラインからの入力を扱うために複数のゴルーチンを起動するプロセス
利用すべき条件
・そのステージがより前の計算結果に依存していない
・実行が長時間に及ぶ

ファンイン：複数の結果を一つのチャネルに結合するプロセス

## or-doneチャネル

```go
orDone := func(done, c <-chan interface{}) <-chan interface{} {
	valStream := make(chan interface{})
	go func() {
		defer close(valStream)
		for {
			select {
			case <-done:
				return
			case v, ok := <-c:
				if ok == false {
					return
				}
				select {
				case valStream <- v:
				case <-done:
				}
			}
		}
	}()
	return valStream
}

for val := range orDone(done, myChan) {
}
```

## teeチャネル

チャネルからのストリームを2つに分け、同じ値を2つの異なる場所で使う場合

```go
tee := func(
	done <-chan interface{},
	in <-chan interface{},
) (_, _ <-chan interface{}) {
	out1 := make(chan interface{})
	out2 := make(chan interface{})
	go func() {
		defer close(out1)
		defer close(out2)
		for val := range orDone(done, in) {
			var out1, out2 = out1, out2
			for i := 0; i < 2; i++ {
				select {
				case out1<-val:
					out1 = nil
				case out2<-val:
					out2 = nil
				}
			}
		}
	}()
	return out1, out2
}

done := make(chan interface{})
defer close(done)

out1, out2 := tee(done, take(done, repeat(done, 1, 2), 4))

for val1 := range out1 {
	fmt.Printf("out1: %v, out2: %v\n", val1, <-out2)
}
```

## bridgeチャネル

チャネルのシーケンスから値を消費する場合

```go
bridge := func(
	done <-cahn interface{},
	chanStream <- chan <-chan interface{},
) <-chan interface{} {
	valStream := make(chan interface{})
	go func() {
		defer close(valStream)
		for {
			var stream <-chan interface{}
			select {
			case maybeStream, ok := <-chanStream:
				if ok == false {
					return
				}
				stream = maybeStream
			}
			case <-done:
				return
		}
		for val := range orDone(done, stream) {
			select {
			case valStream <- val:
			case <-done:
			}
		}
	}()
	return valStream
}

genVals := func() <-chan <-chan interface{} {
	chanStream := make(chan (<-chan interface{}))
	go func() {
		defer close(chanStream)
		for i := 0; i < 10; i++ {
			stream := make(chan interface{}, 1)
			stream <- i
			close(stream)
			chanStream <- stream
		}
	}()
	return chanStream
}

for v := range bridge(nil, genVals()) {
	fmt.Printf("%v ", v)
}
```

## キュー

プログラム最適化の最後に導入すべき
導入すべき状況
・ステージ内でのバッチによるリクエストが時間を節約する場合
・ステージにおける遅延がシステムにフィードバックループを発生させる場合

ステージを分離できる

## contextパッケージ

2つの目的
・コールグラフの各枝をキャンセルするAPIを提供する
・コールグラフを通じてリクエストに関するデータを渡すデータの置き場所を提供する

WithValueとValue
・使用するキーは比較可能性を満たさなければならない
・返された値は複数の後ルーチンからアクセスされても安全でなければならない

```go
func main() {
	ProcessRequest("jane", "abc134")
}

type ctxKey int

const (
	ctxUserID ctxKey = iota
	ctxAuthToken
)

func UserID(c context.Context) string {
	return c.Value(ctxUserID).(string)
}

func AuthToken(c context.Context) string {
	return c.Value(ctxAuthToken).(string)
}

func ProcessRequest(userID, authToken string) {
	ctx := context.WithValue(context.Background(), ctxUserID, userID)
	ctx = context.WithValue(ctx, ctxAuthToken, authToken)
	HandleResponse(ctx)
}
func HandleResponse(ctx context.Context) {
	fmt.Printf(
		"handling response for %v (auth: %v)",
		UserID(ctx),
		AuthToken(ctx),
	)
}
```

コンテキスト値はプロセスやAPIの境界を通過するリクエストスコープでのデータに絞って使いましょう。
関数にオプションのパラメーターを渡すために使うべきではありません。

・データはプロセスやAPIの境界を通過すべき
・データは不変であるべき
・データは単純な型に向かっていくべき
・データはデータであるべきでメソッド付きの型であるべきではない
・データは修飾の操作を助けるべきものであって、それを駆動するものではない

# 5章 大規模開発での並行処理

## エラー伝播

エラーに必要な情報
・何が起きたのか
・いつどこでエラーが発生したか
・ユーザー向けの読みやすいメッセージ
・ユーザーがさらに情報を得るにはどうするべきか

各コンポーネントの教会では、下から上がってきたエラーは自分のコンポーネント向けにきちんとした形のエラーになるように包んで整えてやらなければならない

## タイムアウトとキャンセル処理

タイムアウトするべき理由

システム飽和状態
・リクエストがタイムアウトしたときに重複しなさそうな場合
・リクエストを保存するリソースがない場合（例：インメモリキュー用のメモリ、永続キュー用のディスク容量）
・リクエストやリクエストが送っているデータが処理待ちをしている間に古くなってしまった場合

新鮮でないデータ

デッドロックを防ぐ試み
システムがデッドロックに陥らないよう保証するために全ての並列処理にタイムアウトを設定するのは推奨されている。

キャンセル処理するべき理由

タイムアウト

ユーザーによる介入
プロセスの状態を確認できるようにすること、ユーザーに起動した処理をキャンセルできるようにすること

親のキャンセル

複製されたリクエスト
複数の並行処理のプロセスに、どれかが早くレスポンスを返してくれることを期待して、複製したデータを送り、最初の1つが返ってきたとき

並行処理のプロセスが割り込み可能になる期間を定めること
この期間よりも長くかかりそうな機能は確実にそれ自身を割り込み可能にすること

子のステージがメッセージを受け取った後で、親のステージがキャンセル処理のメッセージを受け取ったとき、このステージが複製されたメッセージを受け取る可能性がある
→複製されたメッセージを送らないようにする方法
・ステージ間で双方向のやりとりを行う（ハートビート）
・最初か最後に報告された結果だけを受け入れる
・親のゴルーチンに対しポーリングして許可を得る

## ハートビート

並行処理のプロセスが生きていることを外に伝える方法（k8sではどう実装してるんだろ）

・一定周期で発生するハートビート

```go
doWork := func(
	done <-chan interface{},
	pulseInterval time.Duration,
) (<-chan interface{}, <-chan time.Time) {
	heartbeat := make(chan interface{})
	results := make(chan time.Time)
	go func() {
		defer close(heartbeat)
		defer close(results)

		pulse := time.Tick(pulseInterval)
		workGen := time.Tick(2*pulseInterval)

		sendPulse := func() {
			select {
			case heartbeat <-struct{}{}:
			default:
			}
		}
		sendResult := func(r time.Time) {
			for {
				select {
				case <-done:
					return
				case <-pulse:
					sendPulse()
				case results <- r:
					return
				}
			}
		}
	
		for {
			select {
			case <-done:
				return
			case <-pulse:
				sendPulse()
			case r := <-workGen:
				sendResult(r)
			}
		}
	}()
	return heartbeat, results
}

done := make(chan interface{})
time.AfterFunc(10*time.Second, func() { close(done) })

const timeout = 2*time.Second
heartbeat, results := doWork(done, timeout/2)
for {
	select {
	case _, ok := <-heartbeat:
		if !ok {
			return
		}
		fmt.Println("pulse")
	case r, ok := ,-results:
		if ok == false {
			return
		}
		fmt.Printf("results %v\n", r.Second())
	case <-time.After(timeout):
		return
	}
}
```

・仕事単位の最初に発生するハートビート

```go
doWork := func(done <-chan interface{}) (<-chan interface{}, <-chan int) {
	heartbeatStream := make(chan interface{}, 1)
	workStream := make(chan int)
	go func() {
		defer close(heartbeatStream)
		defer close(workStream)

		for i := 0; i < 10; i++ {
			select {
			case heartbeatStream <- struct{}{}:
			default:
			}

			select {
			case <-done:
				return
			case workStream <- rand.Intn(10):
			}
		}
	}()
	return heartbeatStream, workStream
}

done := make(chan interface{})
defer close(done)

heartbeat, results := doWork(done)
for {
	select {
	case _, ok := <-heartbeat:
		if ok {
			fmt.Println("pulse")
		} else {
			return
		}
	case r, ok := <-results:
		if ok {
			fmt.Printf("results %v\n", r)
		} else {
			return
		}
	}
}

func TestDoWork_GenerateAllNumbers(t *testing.T) {
	done := make(chan interface{})
	defer close(done)

	intSlice := []int{0, 1, 2, 3, 5}
	heartbeat, results := DoWork(done, intSlice...)

	<-heartbeat

	i := 0
	for r := range results {
		if expected := intSlice[i]; r != expected {
			t.Errorf("index %v: expected %v, but received %v,", i, expected, r)
		}
	}
}
```

## 複製されたリクエスト

レスポンスをできる限り速く受け取ることが最優先であるとき
ハンドラーが処理のために使うリソースは同様に複製する必要がありコストがかかる

## 流量制限

トークンバケット
アクセストークンを持ってリソースを利用する
所持できるトークンの数（バケットの深さ）とトークンが補充される速度によって、制限する

## 不健全なゴルーチンを直す

```go
type startGoroutineFn func(
	done <-chan interface{},
	pulseInterval time.Duration,
) (heartbeat <-chan interface{})

newSteward := func(
	timeout time.Duration,
	 startGoroutine startGoroutineFn,
) startGoroutineFn {
	return func(
		done <-chan interface{},
		pulseInterval time.Duration,
	) (<-chan interface{}) {
		heartbeat := make(chan interface{})
		go func() {
			defer close(heartbeat)

			var wardDone chan interface{}
			var wardHeartbeat <-chan interface{}
			startWard := func() {
				wardDone = make(chan interface{})
				wardHeartbeat = startGoroutine(or(wardDone, done), timeout/2)
			}
			startWard()
			pulse := time.Tick(pulseInterval)

		monitorLoop:
			for {
				timeoutSignal := time.After(timeout)

				for {
					select {
					case <-pulse:
						select {
						case heartbeat <- struct{}{}:
						default:
						}
					case <-wardHeartbeat:
						continue monitorLoop
					case <-timeoutSignal:
						log.Println("steward: ward unhealthy; restarting")
						close(wardDone)
						startWard()
						continue monitorLoop
					case <-done:
						return
					}
				}
			}
		}()

		return heartbeat
	}
}
```

```go
doWorkFn := func(
	done <-chan interface{},
	intList ...int
) (startGoroutineFn, <-chan interface{}) {
	intChanStream := make(chan (<-chan interface{}))
	intStream := bridge(done, intChanStream)
	doWork := func(
		done <-chan interface{},
		pulseInterval time.Duration,
	) <-chan interface{} {
		intStream := make(chan interface{})
		heartbeat := make(chan interface{})
		go func() {
			defer close(intStream)
			select {
			case intChanStream <- intStream:
			case <-done:
				return
			}

			pulse := time.Tick(pulseInterval)

			for {
				valueLoop:
				for _, intVal := range intList {
					if intVal < 0 {
						log.Printf("negative value :%V\n", intVal)
						return
					}

					for {
						select {
						case <-pulse:
							select {
							case heartbeat <- struct{}{}:
							default:
							}
						case intStream <- intVal:
							continue valueLoop
						case <-done:
							return
						}
					}
				}
			}
		}()
		return heartbeat
	}
	return doWork, intStream
}

done := make(chan interface{})
defer close(done)

doWork, intStream := doWorkFn(done, 1, 2, -1, 3, 4, 5)
doWorkWithSteward := newSteward(1*time.Millisecond, doWork)
doWorkWithSteward(done, 1*time.Hour)

for intVal := range take(done, intStream, 6) {
	fmt.Printf("Received: %v\n", intVal)
}
```

# 6章 ゴルーチンとGoランタイム

## ワークスティーリング

フェアスケジューリング：各プロセッサーが平等に同数のタスク数を持つような戦略
→使用率が高くないプロセッサーが出てしまう可能性がある
→あるタスクが他のプロセッサーで稼働しているタスクと同じデータを必要としていたりするのでキャッシュの局所性が乏しくなることがある

ワークスティーリングアルゴリズム
1. 分岐地点では、タスクをそのスレッドに紐づいているデックの最後尾に追加します
2. そのスレッドがアイドルなときは、ほかの任意のスレッドに紐づいたデックの先頭から処理を盗みます
3. まだ実現していない合流地点（未達の合流地点、つまり、同期しているゴルーチンがまだ完了していない）において、そのスレッドが持っているデックの最後尾からタスクを取り出します
4. もしスレッドのデックが空ならば次のどちらかを行います。
   a. 合流地点で停止する

b. 任意のスレッドに紐付いたデックの先頭からタスクを盗む

最後尾のタスクはほぼ間違いなく親の合流を完了させるために必要になる

最後尾のタスクはほぼ間違いなく依然としてプロセッサーのキャッシュにある

継続スティーリング
ゴルーチンではなく、継続をデックに入れる

G：ゴルーチン
M：OSスレッド（マシン）
P：コンテキスト（プロセッサー）
