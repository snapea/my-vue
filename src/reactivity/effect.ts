import { extend } from '../shared'

class ReactiveEffect {
    private _fn: any
    deps = []
    active = true
    onStop?: () => void
    public scheduler: Function | undefined
    constructor(fn, scheduler?: Function) {
        this._fn = fn
        this.scheduler = scheduler
    }

    run() {
        activeEffect = this
        return this._fn()
    }
    stop() {
        if (this.active) {
            clearupEffect(this)
            if (this.onStop) {
                this.onStop()
            }
            this.active = false
        }
    }
}
function clearupEffect(effect) {
    effect.deps.forEach((dep: any) => {
        dep.delete(effect)
    })
}
// 根据target存key 再根据key存key对应的改变key的函数
const targetMap = new Map()
export function track(target, key) {
    // target  --> key --> dep
    let depMap = targetMap.get(target)
    if (!depMap) {
        depMap = new Map()
        targetMap.set(target, depMap)
    }

    let dep = depMap.get(key)
    if (!dep) {
        dep = new Set()
        depMap.set(key, dep)
    }
    if (!activeEffect) return
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
}

export function trigger(target, key) {
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)

    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }
    }
}

let activeEffect
export function effect(fn, options: any = {}) {
    const scheduler = options.scheduler

    const _effect = new ReactiveEffect(fn, scheduler)
    extend(_effect, options)

    _effect.run()
    const runner: any = _effect.run.bind(_effect)
    runner.effect = _effect
    return runner
}

export function stop(runner) {
    runner.effect.stop()
}
